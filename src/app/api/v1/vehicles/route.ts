import { NextResponse } from 'next/server';
import prisma from '@/modules/core/db';
import { getCurrentUser } from '@/modules/auth/guard';
import { PublicationStatus, BusCategory, Prisma } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const isAdminQuery = url.searchParams.get('admin') === 'true';

    // Staff admin check
    const user = await getCurrentUser();
    const isStaff = user && ['ADMIN', 'INSPECTOR', 'SALES_EXECUTIVE'].includes(user.role);

    if (isAdminQuery && isStaff) {
      const listings = await prisma.listing.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          vehicle: {
            include: {
              seller: { select: { id: true, name: true, phone: true } },
              documents: { select: { id: true, docType: true, status: true, expiresAt: true } },
              inspections: { select: { id: true, status: true, overallScore: true } },
            },
          },
        },
      });

      return NextResponse.json({ success: true, listings });
    }

    // Public Query: Strictly published only
    const category = url.searchParams.get('category');
    const district = url.searchParams.get('district');
    const make = url.searchParams.get('make');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '24', 10);
    const skip = (page - 1) * pageSize;

    const where: Prisma.ListingWhereInput = {
      publicationStatus: PublicationStatus.PUBLISHED,
    };

    const vehicleWhere: Prisma.VehicleWhereInput = {};
    if (category && Object.values(BusCategory).includes(category as BusCategory)) {
      vehicleWhere.category = category as BusCategory;
    }
    if (district) vehicleWhere.district = { equals: district, mode: 'insensitive' };
    if (make) vehicleWhere.make = { equals: make, mode: 'insensitive' };

    where.vehicle = vehicleWhere;

    const total = await prisma.listing.count({ where });
    const listings = await prisma.listing.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          slug: true,
          askingPrice: true,
          featured: true,
          publishedAt: true,
          vehicle: {
            select: {
              id: true,
              make: true,
              model: true,
              manufactureYear: true,
              registrationYear: true,
              category: true,
              bodyType: true,
              fuelType: true,
              transmission: true,
              odometerKm: true,
              seatingCapacity: true,
              sleeperConfig: true,
              acType: true,
              district: true,
              city: true,
              media: {
                where: { isPrimary: true },
                select: { storageKey: true },
                take: 1,
              },
              // PRIVACY RULE: Seller phone, email, and private documents are NEVER selected!
              seller: {
                select: {
                  sellerProfile: {
                    select: { sellerType: true, businessName: true, district: true },
                  },
                },
              },
            },
          },
        },
      });

    return NextResponse.json({
      success: true,
      total,
      page,
      pageSize,
      listings,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch vehicles';
    return NextResponse.json({ error: { code: 'FETCH_FAILED', message } }, { status: 500 });
  }
}
