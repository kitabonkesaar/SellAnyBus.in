import { NextResponse } from 'next/server';
import { requireAuth } from '@/modules/auth/guard';
import { VehicleService } from '@/modules/vehicles/vehicle.service';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

    const updatedListing = await VehicleService.approveSellerPrice(session.userId, id, ip);
    return NextResponse.json({
      success: true,
      message: 'Asking price successfully approved!',
      listing: updatedListing,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Price approval failed';
    return NextResponse.json({ error: { code: 'APPROVAL_FAILED', message } }, { status: 400 });
  }
}
