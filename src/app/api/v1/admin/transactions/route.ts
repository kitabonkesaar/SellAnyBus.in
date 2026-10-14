import { NextResponse } from 'next/server';
import { requireRole } from '@/modules/auth/guard';
import prisma from '@/modules/core/db';
import { AuditService } from '@/modules/audit/audit.service';
import { Role, PaymentStatus, TransferStatus, Prisma } from '@prisma/client';

export async function GET() {
  try {
    await requireRole([Role.ADMIN]);
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        listing: {
          include: {
            vehicle: {
              select: { id: true, make: true, model: true, registrationNumber: true, city: true },
            },
          },
        },
        lead: {
          include: { enquiry: true },
        },
      },
    });

    return NextResponse.json({ success: true, transactions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unauthorized';
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message } }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireRole([Role.ADMIN]);
    const body = await req.json();
    const { listingId, leadId, agreedPrice, feeType, feeAmount, paymentStatus, evidenceKey, docChecklist } = body;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

    // Hard Rule: cannot be CONFIRMED without evidence or explicit admin confirmation
    if (paymentStatus === PaymentStatus.CONFIRMED && !evidenceKey) {
      throw new Error('A transaction cannot be marked financially settled without evidence upload.');
    }

    const transaction = await prisma.transaction.create({
      data: {
        listingId,
        leadId: leadId || null,
        agreedPrice: parseInt(agreedPrice, 10),
        feeType: feeType || 'COMMISSION_PERCENT',
        feeAmount: parseInt(feeAmount || '0', 10),
        paymentStatus: paymentStatus || PaymentStatus.NOT_STARTED,
        evidenceKeys: evidenceKey ? [evidenceKey] : undefined,
        confirmedBy: paymentStatus === PaymentStatus.CONFIRMED ? session.userId : null,
        confirmedAt: paymentStatus === PaymentStatus.CONFIRMED ? new Date() : null,
        docChecklist: (docChecklist as unknown as Prisma.InputJsonValue) || {
          form29_30: false,
          nocIssued: false,
          insuranceTransferred: false,
        },
        transferStatus: TransferStatus.IN_PROGRESS,
      },
    });

    await AuditService.log({
      actorId: session.userId,
      action: 'TRANSACTION_CREATED',
      entityType: 'Transaction',
      entityId: transaction.id,
      after: { agreedPrice, paymentStatus, feeAmount },
      reason: 'Admin initiated managed vehicle transaction record',
      ip,
    });

    return NextResponse.json({ success: true, transaction });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Transaction failed';
    return NextResponse.json({ error: { code: 'TRANSACTION_FAILED', message } }, { status: 400 });
  }
}
