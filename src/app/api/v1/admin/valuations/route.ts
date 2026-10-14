import { NextResponse } from 'next/server';
import { requireRole } from '@/modules/auth/guard';
import { ValuationService } from '@/modules/valuations/valuation.service';
import { Role } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const session = await requireRole([Role.ADMIN]);
    const body = await req.json();
    const { vehicleId, rangeMin, rangeMax, recommendedPrice, comparables, factors } = body;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

    const valuation = await ValuationService.submitValuation(
      session.userId,
      {
        vehicleId,
        rangeMin: parseInt(rangeMin, 10),
        rangeMax: parseInt(rangeMax, 10),
        recommendedPrice: parseInt(recommendedPrice, 10),
        comparables,
        factors,
      },
      ip
    );

    return NextResponse.json({ success: true, valuation });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Valuation creation failed';
    return NextResponse.json({ error: { code: 'VALUATION_FAILED', message } }, { status: 400 });
  }
}
