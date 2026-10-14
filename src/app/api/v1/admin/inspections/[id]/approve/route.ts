import { NextResponse } from 'next/server';
import { requireRole } from '@/modules/auth/guard';
import { InspectionService } from '@/modules/inspections/inspection.service';
import { Role } from '@prisma/client';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole([Role.ADMIN]);
    const { id } = await context.params;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

    const approved = await InspectionService.approveInspection(session.userId, id, ip);
    return NextResponse.json({ success: true, inspection: approved });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Approval failed';
    return NextResponse.json({ error: { code: 'APPROVE_FAILED', message } }, { status: 400 });
  }
}
