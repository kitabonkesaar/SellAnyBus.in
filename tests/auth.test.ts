import { describe, it, expect } from 'vitest';
import { AuthService } from '../src/modules/auth/auth.service';
import { AuditService } from '../src/modules/audit/audit.service';
import { verifyAccessToken, signAccessToken } from '../src/modules/auth/jwt';
import { Role } from '@prisma/client';

describe('Auth & RBAC Module', () => {
  it('should request OTP for a valid 10-digit Indian mobile number', async () => {
    const res = await AuthService.requestOtp('9876543210');
    expect(res.success).toBe(true);
  });

  it('should reject invalid mobile numbers', async () => {
    await expect(AuthService.requestOtp('12345')).rejects.toThrow();
  });

  it('should verify OTP and authenticate user with dev code 123456', async () => {
    const res = await AuthService.verifyOtp({
      phone: '9876543210',
      code: '123456',
    });
    expect(res.user).toBeDefined();
    expect(res.accessToken).toBeDefined();
    expect(res.refreshToken).toBeDefined();

    // Verify access token
    const payload = await verifyAccessToken(res.accessToken);
    expect(payload?.userId).toBe(res.user.id);
  });

  it('should fail with incorrect OTP in non-dev or wrong code', async () => {
    await expect(
      AuthService.verifyOtp({
        phone: '9876543210',
        code: '999999',
      })
    ).rejects.toThrow();
  });

  it('should authenticate Admin staff with email and password', async () => {
    const res = await AuthService.staffLogin('admin@sellanybus.in', 'Admin@SellAnyBus2026!');
    expect(res.user.role).toBe(Role.ADMIN);
    expect(res.accessToken).toBeDefined();
  });

  it('should reject staff login with incorrect password', async () => {
    await expect(
      AuthService.staffLogin('admin@sellanybus.in', 'WrongPassword123')
    ).rejects.toThrow('Invalid email or credentials');
  });

  it('should create an append-only audit log entry', async () => {
    const log = await AuditService.log({
      action: 'TEST_ACTION',
      entityType: 'TestEntity',
      entityId: 'test-123',
      reason: 'Automated verification test',
    });
    expect(log).toBeDefined();
    expect(log?.action).toBe('TEST_ACTION');
    expect(log?.entityType).toBe('TestEntity');
  });
});
