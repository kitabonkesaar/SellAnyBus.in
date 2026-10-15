import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/modules/auth/guard';
import prisma from '@/modules/core/db';
import { Prisma } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    let phone: string | null = null;
    let filters: Record<string, unknown> = {};

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      phone = formData.get('phone') as string;
      const filtersRaw = formData.get('filters') as string;
      if (filtersRaw) {
        try {
          filters = JSON.parse(filtersRaw);
        } catch {
          // Ignore
        }
      }
    } else {
      const body = await req.json();
      phone = body.phone;
      filters = body.filters;
    }

    if (!user && !phone) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Phone number is required to save an alert' } },
        { status: 400 }
      );
    }

    const alert = await prisma.savedSearchAlert.create({
      data: {
        userId: user?.userId || null,
        phone: phone ? phone.replace(/\D/g, '').slice(-10) : null,
        filters: (filters || {}) as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Search alert saved! We will notify you when matching buses arrive.',
      alertId: alert.id,
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: { code: 'ALERT_FAILED', message: 'Failed to save alert' } }, { status: 400 });
  }
}
