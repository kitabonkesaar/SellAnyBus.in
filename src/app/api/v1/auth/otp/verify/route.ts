import { NextResponse } from 'next/server';
import { AuthService } from '@/modules/auth/auth.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, code, name, sellerType, businessName, district } = body;

    if (!phone || !code) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Phone and OTP code are required' } },
        { status: 400 }
      );
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

    const result = await AuthService.verifyOtp(
      { phone, code, name, sellerType, businessName, district },
      ip
    );

    const response = NextResponse.json({
      success: true,
      user: result.user,
    });

    const isProd = process.env.NODE_ENV === 'production';

    // Access token cookie (15 mins)
    response.cookies.set('sb_access_token', result.accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    });

    // Refresh token cookie (7 days)
    response.cookies.set('sb_refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Verification failed';
    return NextResponse.json(
      { error: { code: 'OTP_VERIFY_FAILED', message } },
      { status: 400 }
    );
  }
}
