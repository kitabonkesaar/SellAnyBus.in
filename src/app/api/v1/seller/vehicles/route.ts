import { NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/modules/auth/guard';
import { VehicleService } from '@/modules/vehicles/vehicle.service';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    const session = await requireAuth();
    const data = await VehicleService.getSellerDashboard(session.userId);
    return NextResponse.json({ success: true, ...data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch vehicles';
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message } }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireRole([Role.SELLER, Role.ADMIN]);
    const body = await req.json();
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

    const vehicle = await VehicleService.saveDraft(session.userId, body, ip);
    return NextResponse.json({ success: true, vehicle });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save vehicle draft';
    return NextResponse.json({ error: { code: 'SAVE_FAILED', message } }, { status: 400 });
  }
}
