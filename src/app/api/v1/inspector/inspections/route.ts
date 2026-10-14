import { NextResponse } from 'next/server';
import { requireRole } from '@/modules/auth/guard';
import prisma from '@/modules/core/db';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    const session = await requireRole([Role.INSPECTOR, Role.ADMIN]);
    const inspections = await prisma.inspection.findMany({
      where: session.role === Role.ADMIN ? undefined : { inspectorId: session.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            registrationNumber: true,
            category: true,
            city: true,
            district: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, inspections });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unauthorized';
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message } }, { status: 403 });
  }
}
