import { NextResponse } from 'next/server';
import { requireAuth } from '@/modules/auth/guard';
import { VehicleService } from '@/modules/vehicles/vehicle.service';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

    const updated = await VehicleService.submitForVerification(session.userId, id, ip);
    return NextResponse.json({ success: true, vehicle: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Submission failed';
    return NextResponse.json({ error: { code: 'SUBMIT_FAILED', message } }, { status: 400 });
  }
}
