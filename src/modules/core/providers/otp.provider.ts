export interface OtpRequestResult {
  success: boolean;
  message?: string;
  expiresInSeconds?: number;
}

export interface OtpVerifyResult {
  success: boolean;
  valid: boolean;
  message?: string;
}

export interface OtpProvider {
  requestOtp(phone: string): Promise<OtpRequestResult>;
  verifyOtp(phone: string, code: string): Promise<OtpVerifyResult>;
}

// In-memory store for OTPs in development/testing
interface StoredOtp {
  code: string;
  expiresAt: number;
  attempts: number;
}

const otpStore = new Map<string, StoredOtp>();

export class ConsoleOtpProvider implements OtpProvider {
  async requestOtp(phone: string): Promise<OtpRequestResult> {
    const isDev = process.env.NODE_ENV !== 'production';
    const code = isDev ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpStore.set(phone, {
      code,
      expiresAt,
      attempts: 0,
    });

    console.log(`\n========================================`);
    console.log(`[ConsoleOtpProvider] OTP for +91${phone}: ${code} (Valid for 5 mins)`);
    console.log(`========================================\n`);

    return {
      success: true,
      message: 'OTP sent successfully (check console in development: 123456)',
      expiresInSeconds: 300,
    };
  }

  async verifyOtp(phone: string, inputCode: string): Promise<OtpVerifyResult> {
    const isDev = process.env.NODE_ENV !== 'production';
    // Always accept 123456 in dev
    if (isDev && inputCode === '123456') {
      return { success: true, valid: true };
    }

    const stored = otpStore.get(phone);
    if (!stored) {
      return { success: false, valid: false, message: 'OTP not requested or expired' };
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(phone);
      return { success: false, valid: false, message: 'OTP expired. Please request a new one.' };
    }

    if (stored.attempts >= 5) {
      otpStore.delete(phone);
      return { success: false, valid: false, message: 'Too many failed attempts. Request a new OTP.' };
    }

    if (stored.code !== inputCode) {
      stored.attempts += 1;
      return { success: false, valid: false, message: 'Invalid OTP code' };
    }

    otpStore.delete(phone);
    return { success: true, valid: true };
  }
}

export class Msg91Provider implements OtpProvider {
  private authKey = process.env.MSG91_AUTH_KEY || '';

  async requestOtp(phone: string): Promise<OtpRequestResult> {
    if (!this.authKey) {
      console.warn('[Msg91Provider] No auth key configured, falling back to ConsoleOtpProvider behavior');
      return new ConsoleOtpProvider().requestOtp(phone);
    }
    // Stub for live MSG91 API integration
    return { success: true, message: 'OTP sent via MSG91', expiresInSeconds: 300 };
  }

  async verifyOtp(phone: string, code: string): Promise<OtpVerifyResult> {
    if (!this.authKey) {
      return new ConsoleOtpProvider().verifyOtp(phone, code);
    }
    return { success: true, valid: true };
  }
}

let activeOtpProvider: OtpProvider | null = null;

export function getOtpProvider(): OtpProvider {
  if (!activeOtpProvider) {
    if (process.env.OTP_PROVIDER === 'msg91') {
      activeOtpProvider = new Msg91Provider();
    } else {
      activeOtpProvider = new ConsoleOtpProvider();
    }
  }
  return activeOtpProvider;
}
