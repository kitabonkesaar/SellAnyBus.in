import { NextResponse } from 'next/server';
import { requireRole } from '@/modules/auth/guard';
import { ListingService } from '@/modules/listings/listing.service';
import { Role, PublicationStatus } from '@prisma/client';

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole([Role.ADMIN]);
    const { id: listingId } = await context.params;
    const body = await req.json();
    const { status, reason, featured } = body;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

    // Handle toggle featured
    if (featured !== undefined) {
      const updated = await ListingService.setFeatured(session.userId, listingId, Boolean(featured), 30, ip);
      return NextResponse.json({ success: true, listing: updated });
    }

    // Handle status change
    if (status === PublicationStatus.PUBLISHED) {
      // Enforce all 3 hard publishing gates!
      const published = await ListingService.publishListing(session.userId, listingId, ip);
      return NextResponse.json({
        success: true,
        message: 'Listing successfully published to marketplace!',
        listing: published,
      });
    }

    if (status && Object.values(PublicationStatus).includes(status)) {
      const updated = await ListingService.updateListingStatus(session.userId, listingId, status, reason, ip);
      return NextResponse.json({ success: true, listing: updated });
    }

    return NextResponse.json({ error: { code: 'INVALID_REQUEST', message: 'No valid action provided' } }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Operation failed';
    return NextResponse.json({ error: { code: 'OPERATION_FAILED', message } }, { status: 400 });
  }
}
