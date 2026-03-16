import { NextRequest, NextResponse } from 'next/server';
import { generateMockFacilities } from '@/lib/mockData';
import { hashIp, checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { AccessibilityFeature } from '@/types';

// ── Try Prisma, fall back to mock data if DB is unavailable ──
async function getPrisma() {
  try {
    const { prisma } = await import('@/lib/prisma');
    // Quick connectivity check
    await prisma.$queryRaw`SELECT 1`;
    return prisma;
  } catch {
    return null;
  }
}

const FEATURE_KEYS: AccessibilityFeature[] = [
  'wheelchair_ramp', 'elevator', 'accessible_restroom', 'braille_signage',
  'tactile_path', 'wide_doorway', 'adjustable_exam_table',
  'sign_language_interpreter', 'priority_queue', 'disabled_parking',
];

// GET /api/facilities
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q         = searchParams.get('q')?.toLowerCase() || '';
  const features  = searchParams.get('features') || '';
  const type      = searchParams.get('type') || '';
  const ids       = searchParams.get('ids') || '';

  const featureList = features ? features.split(',').filter(Boolean) as AccessibilityFeature[] : [];
  const idList      = ids ? ids.split(',').filter(Boolean) : [];

  const prisma = await getPrisma();

  // ── Live DB path ──
  if (prisma) {
    try {
      const where: any = {};
      if (q) where.OR = [{ name: { contains: q, mode: 'insensitive' } }, { address: { contains: q, mode: 'insensitive' } }];
      if (type) where.type = type.replace(' ', '_');
      if (idList.length) where.id = { in: idList };
      if (featureList.length) where.accessibility = { AND: featureList.map(f => ({ [f]: true })) };

      const rows = await prisma.facility.findMany({ where, include: { accessibility: true }, orderBy: { accessibility_score: 'desc' }, take: 50 });

      return NextResponse.json(rows.map((f: typeof rows[0]) => ({
        id: f.id, name: f.name, address: f.address, contact: f.contact,
        lat: f.lat, lng: f.lng, rating: f.rating,
        accessibility_score: f.accessibility_score, photos: f.photos,
        services: f.services,
        type: f.type.replace('_', ' ') as 'Hospital' | 'Clinic' | 'Diagnostic Center',
        verified: f.verified,
        accessibility_features: f.accessibility
          ? FEATURE_KEYS.reduce((acc: Record<string, boolean>, k: string) => { acc[k] = (f.accessibility as any)[k]; return acc; }, {})
          : {},
      })));
    } catch (err) {
      console.error('[GET /api/facilities] DB error, falling back to mock:', err);
    }
  }

  // ── Mock-data fallback ──
  let results = generateMockFacilities(50);
  if (idList.length) results = results.filter(f => idList.includes(f.id));
  if (q) results = results.filter(f => f.name.toLowerCase().includes(q) || f.address.toLowerCase().includes(q));
  if (type) results = results.filter(f => f.type === type);
  if (featureList.length) results = results.filter(f => featureList.every(feat => f.accessibility_features[feat]));
  results = results.sort((a, b) => b.accessibility_score - a.accessibility_score).slice(0, 50);

  return NextResponse.json(results, { headers: { 'X-Data-Source': 'mock' } });
}

// POST /api/facilities
export async function POST(req: NextRequest) {
  const clientIp  = getClientIp(req);
  const ipHash    = hashIp(clientIp);
  const rlKey     = `submit:${ipHash}`;

  if (!checkRateLimit(rlKey, 24 * 60 * 60 * 1000, 3)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Max 3 submissions per 24 hours.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { name, type, address, contact, lat, lng, services, photos, accessibility } = body;

    if (!name || !type || !address) {
      return NextResponse.json({ error: 'name, type, and address are required.' }, { status: 400 });
    }

    const accessMap = FEATURE_KEYS.reduce((acc: Record<string, boolean>, k: string) => {
      acc[k] = accessibility?.[k] ?? false; return acc;
    }, {});
    const score = Math.round((FEATURE_KEYS.filter(k => accessMap[k]).length / FEATURE_KEYS.length) * 100);

    const prisma = await getPrisma();
    if (prisma) {
      const facility = await prisma.facility.create({
        data: { name, type: type.replace(' ', '_'), address, contact: contact || '', lat: lat ?? 0, lng: lng ?? 0, services: services ?? [], photos: photos ?? [], accessibility_score: score, verified: false, accessibility: { create: accessMap } },
        include: { accessibility: true },
      });
      return NextResponse.json(facility, { status: 201 });
    }

    // Mock response when no DB
    return NextResponse.json({
      id: `mock-${Date.now()}`, name, type, address, contact: contact || '',
      lat: lat ?? 19.07, lng: lng ?? 72.87, services: services ?? [],
      photos: photos ?? [], accessibility_score: score, verified: false,
      accessibility_features: accessMap,
    }, { status: 201, headers: { 'X-Data-Source': 'mock' } });

  } catch (err) {
    console.error('[POST /api/facilities]', err);
    return NextResponse.json({ error: 'Failed to submit facility.' }, { status: 500 });
  }
}
