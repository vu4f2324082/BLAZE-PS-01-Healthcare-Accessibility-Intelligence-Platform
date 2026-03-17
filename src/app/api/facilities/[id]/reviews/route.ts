import { NextRequest, NextResponse } from 'next/server';
import { hashIp, checkRateLimit, getClientIp } from '@/lib/rateLimit';

async function getPrisma() {
  try {
    const { prisma } = await import('@/lib/prisma');
    await prisma.$queryRaw`SELECT 1`;
    return prisma;
  } catch { return null; }
}

// GET /api/facilities/:id/reviews
export async function GET(_req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const prisma = await getPrisma();
  if (prisma) {
    try {
      const reviews = await prisma.review.findMany({ where: { facility_id: params.id }, orderBy: { date: 'desc' }, take: 20 });
      return NextResponse.json(reviews.map((r: typeof reviews[0]) => ({
        ...r, date: r.date.toISOString(), user_name: r.user_name ?? 'Anonymous',
      })));
    } catch (err) { console.error('[GET reviews] DB error:', err); }
  }

  // Mock fallback — empty array (UI handles gracefully)
  return NextResponse.json([], { headers: { 'X-Data-Source': 'mock' } });
}

// POST /api/facilities/:id/reviews
export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const clientIp = getClientIp(req);
  const ipHash   = hashIp(clientIp);
  const rlKey    = `review:${ipHash}:${params.id}`;

  if (!checkRateLimit(rlKey, 24 * 60 * 60 * 1000, 1)) {
    return NextResponse.json({ error: 'You can only submit one review per facility every 24 hours.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { rating, comment, user_name } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 });
    }
    if (!comment?.trim()) {
      return NextResponse.json({ error: 'Comment is required.' }, { status: 400 });
    }

    const prisma = await getPrisma();
    if (prisma) {
      const facility = await prisma.facility.findUnique({ where: { id: params.id } });
      if (!facility) return NextResponse.json({ error: 'Facility not found.' }, { status: 404 });

      const review = await prisma.review.create({
        data: { facility_id: params.id, user_name: user_name?.trim() || null, submitter_ip_hash: ipHash, rating: parseInt(rating), comment: comment.trim() },
      });

      const allReviews = await prisma.review.findMany({ where: { facility_id: params.id } });
      const avgRating  = allReviews.reduce((s: number, r: typeof allReviews[0]) => s + r.rating, 0) / allReviews.length;
      await prisma.facility.update({ where: { id: params.id }, data: { rating: parseFloat(avgRating.toFixed(1)), accessibility_score: Math.round((avgRating / 5) * 100) } });

      return NextResponse.json({ ...review, date: review.date.toISOString() }, { status: 201 });
    }

    // Mock response when no DB
    const mockReview = {
      id: `mock-${Date.now()}`, facility_id: params.id,
      user_name: user_name?.trim() || 'Anonymous',
      rating: parseInt(rating), comment: comment.trim(),
      date: new Date().toISOString(),
    };
    return NextResponse.json(mockReview, { status: 201, headers: { 'X-Data-Source': 'mock' } });

  } catch (err) {
    console.error('[POST /api/facilities/:id/reviews]', err);
    return NextResponse.json({ error: 'Failed to submit review.' }, { status: 500 });
  }
}
