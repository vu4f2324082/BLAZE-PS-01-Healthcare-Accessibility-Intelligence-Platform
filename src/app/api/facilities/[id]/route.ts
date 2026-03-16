import { NextRequest, NextResponse } from 'next/server';
import { generateMockFacilities } from '@/lib/mockData';

async function getPrisma() {
  try {
    const { prisma } = await import('@/lib/prisma');
    await prisma.$queryRaw`SELECT 1`;
    return prisma;
  } catch {
    return null;
  }
}

// GET /api/facilities/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = await getPrisma();

  if (prisma) {
    try {
      const facility = await prisma.facility.findUnique({
        where: { id: params.id },
        include: { accessibility: true, reviews: { orderBy: { date: 'desc' }, take: 10 } },
      });
      if (!facility) return NextResponse.json({ error: 'Not found' }, { status: 404 });

      return NextResponse.json({
        facility: {
          ...facility,
          type: facility.type.replace('_', ' '),
          accessibility_features: facility.accessibility ?? {},
        },
        accessibility: facility.accessibility,
        reviews: facility.reviews.map((r: typeof facility.reviews[0]) => ({
          ...r, date: r.date.toISOString(), user_name: r.user_name ?? 'Anonymous',
        })),
      });
    } catch (err) {
      console.error('[GET /api/facilities/:id] DB error, falling back:', err);
    }
  }

  // ── Mock fallback ──
  const facilities = generateMockFacilities(50);
  const facility = facilities.find(f => f.id === params.id) || facilities[0];
  if (!facility) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    facility,
    accessibility: { facility_id: facility.id, ...facility.accessibility_features, services: facility.services },
    reviews: [
      { id: 'r-1', facility_id: facility.id, user_name: 'Riya M.', rating: 4, comment: 'Excellent wheelchair ramps and helpful staff.', date: new Date().toISOString() },
      { id: 'r-2', facility_id: facility.id, user_name: 'Arjun K.', rating: 5, comment: 'Sign language support was very helpful.', date: new Date(Date.now() - 86400000).toISOString() },
    ],
  }, { headers: { 'X-Data-Source': 'mock' } });
}
