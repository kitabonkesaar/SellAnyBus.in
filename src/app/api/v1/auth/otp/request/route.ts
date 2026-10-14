import { NextResponse } from 'next/server';
import { AuthService } from '@/modules/auth/auth.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone } = body;
    if (!phone) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Phone number is required' } },
        { status: 400 }
      );
    }

    const result = await AuthService.requestOtp(phone);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to request OTP';
    return NextResponse.json(
      { error: { code: 'OTP_REQUEST_FAILED', message } },
      { status: 400 }
    );
  }
}
