import prisma from '../core/db';
import { getOtpProvider } from '../core/providers/otp.provider';
import { signAccessToken, signRefreshToken, verifyRefreshToken, TokenPayload } from './jwt';
import { AuditService } from '../audit/audit.service';
import bcrypt from 'bcryptjs';
import { Role, UserStatus, SellerType } from '@prisma/client';

export interface VerifyOtpInput {
  phone: string;
  code: string;
  name?: string;
  sellerType?: SellerType;
  businessName?: string;
  district?: string;
}

export class AuthService {
  /**
   * Request OTP for mobile authentication
   */
  static async requestOtp(phone: string) {
    // Normalize and validate phone (10 digits)
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      throw new Error('Please enter a valid 10-digit Indian mobile number');
    }

    const provider = getOtpProvider();
    return await provider.requestOtp(cleanPhone);
  }

  /**
   * Verify OTP and log in / register user
   */
  static async verifyOtp(input: VerifyOtpInput, ip?: string) {
    const cleanPhone = input.phone.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      throw new Error('Invalid mobile number');
    }

    const provider = getOtpProvider();
    const verifyResult = await provider.verifyOtp(cleanPhone, input.code);
    if (!verifyResult.valid) {
      throw new Error(verifyResult.message || 'Invalid or expired OTP');
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phone: cleanPhone },
      include: { sellerProfile: true },
    });

    if (!user) {
      // Registration flow
      const name = input.name || `User ${cleanPhone.slice(-4)}`;
      const isSeller = Boolean(input.sellerType || input.businessName);

      user = await prisma.user.create({
        data: {
          phone: cleanPhone,
          name,
          role: isSeller ? Role.SELLER : Role.BUYER,
          status: UserStatus.ACTIVE,
          lastLoginAt: new Date(),
          sellerProfile: isSeller
            ? {
                create: {
                  sellerType: input.sellerType || SellerType.INDIVIDUAL_OWNER,
                  businessName: input.businessName || null,
                  district: input.district || 'Khordha',
                },
              }
            : undefined,
        },
        include: { sellerProfile: true },
      });

      await AuditService.log({
        actorId: user.id,
        action: 'USER_REGISTERED_OTP',
        entityType: 'User',
        entityId: user.id,
        after: { phone: cleanPhone, role: user.role, name: user.name },
        ip,
      });
    } else {
      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      await AuditService.log({
        actorId: user.id,
        action: 'USER_LOGIN_OTP',
        entityType: 'User',
        entityId: user.id,
        ip,
      });
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new Error('Account suspended. Please contact support.');
    }

    const tokenPayload: TokenPayload = {
      userId: user.id,
      role: user.role,
      phone: user.phone,
      name: user.name,
      email: user.email,
    };

    const accessToken = await signAccessToken(tokenPayload);
    const refreshToken = await signRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        sellerProfile: user.sellerProfile,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Staff password login (Admin, Inspector, Sales)
   */
  static async staffLogin(email: string, password: string, ip?: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.passwordHash) {
      throw new Error('Invalid email or credentials');
    }

    const allowedStaffRoles: Role[] = [Role.ADMIN, Role.INSPECTOR, Role.SALES_EXECUTIVE];
    if (!allowedStaffRoles.includes(user.role)) {
      throw new Error('Unauthorized staff role');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new Error('Staff account inactive or suspended');
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new Error('Invalid email or credentials');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await AuditService.log({
      actorId: user.id,
      action: 'STAFF_LOGIN',
      entityType: 'User',
      entityId: user.id,
      ip,
    });

    const tokenPayload: TokenPayload = {
      userId: user.id,
      role: user.role,
      phone: user.phone,
      name: user.name,
      email: user.email,
    };

    const accessToken = await signAccessToken(tokenPayload);
    const refreshToken = await signRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh session tokens
   */
  static async refreshSession(refreshToken: string) {
    const payload = await verifyRefreshToken(refreshToken);
    if (!payload?.userId) {
      throw new Error('Invalid or expired refresh token');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true, phone: true, name: true, email: true, status: true },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new Error('User not found or inactive');
    }

    const tokenPayload: TokenPayload = {
      userId: user.id,
      role: user.role,
      phone: user.phone,
      name: user.name,
      email: user.email,
    };

    const newAccessToken = await signAccessToken(tokenPayload);
    const newRefreshToken = await signRefreshToken(user.id);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user,
    };
  }
}
