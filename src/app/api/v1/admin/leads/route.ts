import { NextResponse } from 'next/server';
import { requireRole } from '@/modules/auth/guard';
import prisma from '@/modules/core/db';
import { Role, LeadStage, Prisma } from '@prisma/client';

export async function GET(req: Request) {
  try {
    await requireRole([Role.ADMIN, Role.SALES_EXECUTIVE]);
    const url = new URL(req.url);
    const stage = url.searchParams.get('stage') as LeadStage | null;
    const assigneeId = url.searchParams.get('assigneeId');

    const where: Prisma.LeadWhereInput = {};
    if (stage) where.stage = stage;
    if (assigneeId) where.assigneeId = assigneeId;

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        enquiry: {
          include: {
            listing: {
              include: {
                vehicle: {
                  select: { id: true, make: true, model: true, manufactureYear: true, city: true, district: true },
                },
              },
            },
          },
        },
        assignee: {
          select: { id: true, name: true, phone: true, email: true },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    return NextResponse.json({ success: true, leads });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unauthorized';
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message } }, { status: 403 });
  }
}
