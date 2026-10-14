import { NextResponse } from 'next/server';
import { requireRole } from '@/modules/auth/guard';
import { InspectionService } from '@/modules/inspections/inspection.service';
import { Role } from '@prisma/client';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole([Role.INSPECTOR, Role.ADMIN]);
    const { id } = await context.params;
    const body = await req.json();
    const { checklistResults, overallScore, summary, photos } = body;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

    const updated = await InspectionService.submitInspection(
      session.userId,
      id,
      {
        checklistResults,
        overallScore: parseFloat(overallScore),
        summary,
        photos,
      },
      ip
    );

    return NextResponse.json({ success: true, inspection: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Submission failed';
    return NextResponse.json({ error: { code: 'SUBMIT_FAILED', message } }, { status: 400 });
  }
}
