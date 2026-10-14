import { NextResponse } from 'next/server';
import { requireRole } from '@/modules/auth/guard';
import prisma from '@/modules/core/db';
import { Role, ActivityType } from '@prisma/client';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole([Role.ADMIN, Role.SALES_EXECUTIVE]);
    const { id: leadId } = await context.params;
    const body = await req.json();
    const { type, content } = body;

    if (!type || !content) {
      return NextResponse.json({ error: { code: 'INVALID_INPUT', message: 'Type and content required' } }, { status: 400 });
    }

    const activity = await prisma.leadActivity.create({
      data: {
        leadId,
        type: type as ActivityType,
        content,
        createdBy: session.userId,
      },
    });

    return NextResponse.json({ success: true, activity });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create lead activity';
    return NextResponse.json({ error: { code: 'CREATE_FAILED', message } }, { status: 400 });
  }
}
