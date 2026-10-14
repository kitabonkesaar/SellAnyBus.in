import { NextResponse } from 'next/server';
import { requireRole } from '@/modules/auth/guard';
import { ListingService } from '@/modules/listings/listing.service';
import { Role } from '@prisma/client';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole([Role.ADMIN, Role.INSPECTOR, Role.SALES_EXECUTIVE]);
    const { id: docId } = await context.params;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

    const signedUrl = await ListingService.getSignedDocumentUrl(session.userId, docId, ip);

    return NextResponse.json({
      success: true,
      signedUrl,
      expiresInSeconds: 300,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unauthorized';
    return NextResponse.json({ error: { code: 'ACCESS_DENIED', message } }, { status: 403 });
  }
}
