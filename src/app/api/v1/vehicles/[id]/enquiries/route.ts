import { NextResponse } from 'next/server';
import prisma from '@/modules/core/db';
import { EnquiryStatus, LeadStage, LeadQualification } from '@prisma/client';
import { hashIdentifier } from '@/modules/core/crypto.service';

// In-memory rate limiting store for dev
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) {
    return false;
  }
  entry.count += 1;
  return true;
}

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: listingId } = await context.params;
    const body = await req.json();
    const { name, phone, intendedUse, timeline, message, consent } = body;

    if (!name || !phone || consent !== true) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Name, phone number, and consent are required' } },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: { code: 'INVALID_PHONE', message: 'Invalid 10-digit Indian mobile number' } },
        { status: 400 }
      );
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

    // Rate Limiting: 5/hr per IP, 3/day per phone
    const ipAllowed = checkRateLimit(`ip:${ip}`, 5, 60 * 60 * 1000);
    if (!ipAllowed) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many enquiries from this IP. Please wait an hour.' } },
        { status: 429 }
      );
    }

    const phoneAllowed = checkRateLimit(`phone:${cleanPhone}`, 3, 24 * 60 * 60 * 1000);
    if (!phoneAllowed) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Daily enquiry limit reached for this mobile number.' } },
        { status: 429 }
      );
    }

    // Verify listing is published
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing || listing.publicationStatus !== 'PUBLISHED') {
      return NextResponse.json(
        { error: { code: 'LISTING_NOT_AVAILABLE', message: 'Vehicle is not currently available for enquiries' } },
        { status: 400 }
      );
    }

    // Duplicate detection rule: same phone + same vehicle within 24h -> update existing enquiry
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingEnquiry = await prisma.enquiry.findFirst({
      where: {
        listingId,
        phone: cleanPhone,
        createdAt: { gte: oneDayAgo },
      },
    });

    if (existingEnquiry) {
      const updated = await prisma.enquiry.update({
        where: { id: existingEnquiry.id },
        data: {
          intendedUse,
          timeline,
          message: message || existingEnquiry.message,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Your enquiry was updated with your latest message!',
        enquiryId: updated.id,
      });
    }

    // Create new enquiry
    const enquiry = await prisma.enquiry.create({
      data: {
        listingId,
        name,
        phone: cleanPhone,
        intendedUse,
        timeline,
        message: message || null,
        status: EnquiryStatus.NEW,
        sourceIpHmac: hashIdentifier(ip),
      },
    });

    // Create linked CRM Lead
    const salesAdvisors = await prisma.user.findMany({
      where: { role: 'SALES_EXECUTIVE' },
      take: 2,
    });
    const assigneeId = salesAdvisors.length > 0 ? salesAdvisors[0].id : null;

    await prisma.lead.create({
      data: {
        enquiryId: enquiry.id,
        assigneeId,
        stage: LeadStage.NEW,
        qualification: LeadQualification.UNQUALIFIED,
        followUpAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next 24 hours
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Enquiry submitted successfully! A verified sales advisor will contact you.',
      enquiryId: enquiry.id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to submit enquiry';
    return NextResponse.json({ error: { code: 'ENQUIRY_FAILED', message } }, { status: 400 });
  }
}
