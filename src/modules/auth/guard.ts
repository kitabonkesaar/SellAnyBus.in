import { cookies } from 'next/headers';
import { verifyAccessToken, TokenPayload } from './jwt';
import { Role } from '@prisma/client';
import prisma from '../core/db';

export async function getCurrentUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('sb_access_token')?.value;
  if (!token) {
    return null;
  }

  const payload = await verifyAccessToken(token);
  return payload;
}

export async function requireAuth(): Promise<TokenPayload> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('AUTHENTICATION_REQUIRED');
  }
  return user;
}

export async function requireRole(allowedRoles: Role[]): Promise<TokenPayload> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`ACCESS_DENIED: Required role [${allowedRoles.join(', ')}]`);
  }
  return user;
}

export async function requireSellerOwnership(vehicleId: string, currentUserId: string): Promise<boolean> {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    select: { sellerId: true },
  });
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }
  if (vehicle.sellerId !== currentUserId) {
    throw new Error('IDOR_VIOLATION: You do not have permission to manage this vehicle');
  }
  return true;
}
