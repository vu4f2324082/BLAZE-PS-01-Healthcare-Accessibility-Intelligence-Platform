import { NextRequest, NextResponse } from 'next/server';

async function getPrisma() {
  try {
    const { prisma } = await import('@/lib/prisma');
    await prisma.$queryRaw`SELECT 1`;
    return prisma;
  } catch { return null; }
}

// POST /api/facilities/:id/report
export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const body = await req.json();
    const { issue_type, description } = body;

    if (!description?.trim()) return NextResponse.json({ error: 'Description is required.' }, { status: 400 });
    if (!issue_type) return NextResponse.json({ error: 'Issue type is required.' }, { status: 400 });

    const prisma = await getPrisma();
    if (prisma) {
      const facility = await prisma.facility.findUnique({ where: { id: params.id } });
      if (!facility) return NextResponse.json({ error: 'Facility not found.' }, { status: 404 });

      const report = await prisma.issueReport.create({
        data: { facility_id: params.id, issue_type: issue_type.trim(), description: description.trim(), status: 'OPEN' },
      });
      return NextResponse.json({ ...report, created_at: report.created_at.toISOString() }, { status: 201 });
    }

    // Mock response when no DB
    return NextResponse.json({
      id: `mock-${Date.now()}`, facility_id: params.id,
      issue_type: issue_type.trim(), description: description.trim(),
      status: 'OPEN', created_at: new Date().toISOString(),
    }, { status: 201, headers: { 'X-Data-Source': 'mock' } });

  } catch (err) {
    console.error('[POST /api/facilities/:id/report]', err);
    return NextResponse.json({ error: 'Failed to submit report.' }, { status: 500 });
  }
}
