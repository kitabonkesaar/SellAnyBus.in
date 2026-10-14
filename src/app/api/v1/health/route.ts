import { NextResponse } from 'next/server';
import prisma from '@/modules/core/db';

export async function GET() {
  try {
    // Check DB connectivity
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: 'healthy',
      service: 'SellAnyBus.in',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime(),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Database check failed',
      },
      { status: 503 }
    );
  }
}
