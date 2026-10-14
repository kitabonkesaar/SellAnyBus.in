import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/modules/auth/guard';
import prisma from '@/modules/core/db';

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      phone: true,
      email: true,
      name: true,
      role: true,
      status: true,
      sellerProfile: true,
    },
  });

  if (!user) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  return NextResponse.json({
    authenticated: true,
    user,
  });
}
