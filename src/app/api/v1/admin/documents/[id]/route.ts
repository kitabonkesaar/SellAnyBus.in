import { NextResponse } from 'next/server';
import { requireRole } from '@/modules/auth/guard';
import { ListingService } from '@/modules/listings/listing.service';
import { Role, DocumentStatus } from '@prisma/client';

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole([Role.ADMIN]);
    const { id: docId } = await context.params;
    const body = await req.json();
    const { status, rejectionReason } = body;

    if (!status || !Object.values(DocumentStatus).includes(status)) {
      return NextResponse.json({ error: { code: 'INVALID_STATUS', message: 'Valid status required' } }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

    const updated = await ListingService.verifyDocument(session.userId, docId, status, rejectionReason, ip);

    return NextResponse.json({ success: true, document: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update document verification';
    return NextResponse.json({ error: { code: 'UPDATE_FAILED', message } }, { status: 400 });
  }
}
