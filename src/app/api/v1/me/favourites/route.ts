import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/modules/auth/guard';
import prisma from '@/modules/core/db';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Login required to save favourites' } }, { status: 401 });
    }

    const body = await req.json();
    const { slug } = body;
    const listing = await prisma.listing.findUnique({ where: { slug } });
    if (!listing) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Listing not found' } }, { status: 404 });
    }

    await prisma.favourite.upsert({
      where: {
        userId_listingId: {
          userId: user.userId,
          listingId: listing.id,
        },
      },
      create: {
        userId: user.userId,
        listingId: listing.id,
      },
      update: {},
    });

    return NextResponse.json({ success: true, message: 'Saved to favourites' });
  } catch (error: unknown) {
    return NextResponse.json({ error: { code: 'ERROR', message: 'Failed to update favourite' } }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Login required' } }, { status: 401 });
    }

    const body = await req.json();
    const { slug } = body;
    const listing = await prisma.listing.findUnique({ where: { slug } });
    if (listing) {
      await prisma.favourite.deleteMany({
        where: {
          userId: user.userId,
          listingId: listing.id,
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Removed from favourites' });
  } catch (error: unknown) {
    return NextResponse.json({ error: { code: 'ERROR', message: 'Failed to delete favourite' } }, { status: 400 });
  }
}
