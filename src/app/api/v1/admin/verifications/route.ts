import { NextResponse } from 'next/server';
import { requireRole } from '@/modules/auth/guard';
import prisma from '@/modules/core/db';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    await requireRole([Role.ADMIN, Role.INSPECTOR]);
    const documents = await prisma.vehicleDocument.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            registrationNumber: true,
            district: true,
            seller: {
              select: { name: true, phone: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, documents });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unauthorized';
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message } }, { status: 403 });
  }
}
