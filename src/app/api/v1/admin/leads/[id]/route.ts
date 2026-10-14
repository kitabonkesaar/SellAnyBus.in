import { NextResponse } from 'next/server';
import { requireRole } from '@/modules/auth/guard';
import prisma from '@/modules/core/db';
import { AuditService } from '@/modules/audit/audit.service';
import { Role, ActivityType } from '@prisma/client';

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole([Role.ADMIN, Role.SALES_EXECUTIVE]);
    const { id: leadId } = await context.params;
    const body = await req.json();
    const { stage, qualification, assigneeId, followUpAt, suspicious } = body;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

    const currentLead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!currentLead) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Lead not found' } }, { status: 404 });
    }

    const updated = await prisma.lead.update({
      where: { id: leadId },
      data: {
        stage: stage || currentLead.stage,
        qualification: qualification || currentLead.qualification,
        assigneeId: assigneeId !== undefined ? assigneeId : currentLead.assigneeId,
        followUpAt: followUpAt ? new Date(followUpAt) : currentLead.followUpAt,
        suspicious: suspicious !== undefined ? Boolean(suspicious) : currentLead.suspicious,
      },
    });

    // If stage changed, automatically log a stage change activity
    if (stage && stage !== currentLead.stage) {
      await prisma.leadActivity.create({
        data: {
          leadId,
          type: ActivityType.STAGE_CHANGE,
          content: `Lead moved from ${currentLead.stage} to ${stage}`,
          createdBy: session.userId,
        },
      });

      await AuditService.log({
        actorId: session.userId,
        action: 'LEAD_STAGE_UPDATED',
        entityType: 'Lead',
        entityId: leadId,
        before: { stage: currentLead.stage },
        after: { stage },
        ip,
      });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lead update failed';
    return NextResponse.json({ error: { code: 'UPDATE_FAILED', message } }, { status: 400 });
  }
}
