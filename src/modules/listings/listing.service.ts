import prisma from '../core/db';
import { PublicationStatus, VehicleStatus, DocumentStatus, InspectionStatus } from '@prisma/client';
import { getRequiredDocuments } from '../vehicles/vehicle.schema';
import { AuditService } from '../audit/audit.service';
import { getStorageProvider } from '../core/providers/storage.provider';

export class ListingService {
  /**
   * Hard Rule: Publish listing only if all 3 criteria are satisfied:
   * 1. All required documents are VERIFIED
   * 2. Inspection is APPROVED
   * 3. Seller has recorded explicit price approval
   */
  static async publishListing(adminId: string, listingId: string, ip?: string) {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        vehicle: {
          include: {
            documents: true,
            inspections: { orderBy: { createdAt: 'desc' }, take: 1 },
          },
        },
      },
    });

    if (!listing) {
      throw new Error('Listing not found');
    }

    const { vehicle } = listing;

    // Gate 1: Check Required Documents
    const requiredDocTypes = getRequiredDocuments({
      hypothecated: vehicle.hypothecated,
      permitType: vehicle.permitType,
      insuranceValidTill: vehicle.insuranceValidTill,
    });

    const verifiedDocTypes = new Set(
      vehicle.documents.filter((d) => d.status === DocumentStatus.VERIFIED).map((d) => d.docType)
    );

    const unverifiedDocs = requiredDocTypes.filter((rd) => !verifiedDocTypes.has(rd));
    if (unverifiedDocs.length > 0) {
      throw new Error(
        `CANNOT_PUBLISH: The following required documents are not VERIFIED: ${unverifiedDocs.join(', ')}`
      );
    }

    // Gate 2: Check Inspection is APPROVED
    const latestInspection = vehicle.inspections[0];
    if (!latestInspection || latestInspection.status !== InspectionStatus.APPROVED) {
      throw new Error(
        `CANNOT_PUBLISH: Vehicle inspection is ${latestInspection ? latestInspection.status : 'MISSING'}. Must be APPROVED before publishing.`
      );
    }

    // Gate 3: Check Seller Explicit Price Approval
    if (!listing.sellerApprovedAt || !listing.sellerApprovedPrice) {
      throw new Error(
        'CANNOT_PUBLISH: Seller has not approved the recommended asking price. Seller price approval is required.'
      );
    }

    // All gates passed! Transition to PUBLISHED
    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        publicationStatus: PublicationStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });

    await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { status: VehicleStatus.PUBLISHED },
    });

    await AuditService.log({
      actorId: adminId,
      action: 'LISTING_PUBLISHED',
      entityType: 'Listing',
      entityId: listingId,
      before: { publicationStatus: listing.publicationStatus },
      after: { publicationStatus: PublicationStatus.PUBLISHED },
      reason: 'All verification gates passed: verified docs, approved inspection, seller price approval.',
      ip,
    });

    return updatedListing;
  }

  /**
   * Update listing publication status (SUSPENDED, ARCHIVED, SOLD, REJECTED)
   */
  static async updateListingStatus(
    actorId: string,
    listingId: string,
    newStatus: PublicationStatus,
    reason?: string,
    ip?: string
  ) {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { vehicle: true },
    });

    if (!listing) {
      throw new Error('Listing not found');
    }

    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: { publicationStatus: newStatus },
    });

    // Mirror to vehicle status
    let vehicleStatus: VehicleStatus = VehicleStatus.PUBLISHED;
    if (newStatus === PublicationStatus.SOLD) vehicleStatus = VehicleStatus.SOLD;
    else if (newStatus === PublicationStatus.SUSPENDED) vehicleStatus = VehicleStatus.SUSPENDED;
    else if (newStatus === PublicationStatus.ARCHIVED) vehicleStatus = VehicleStatus.ARCHIVED;

    await prisma.vehicle.update({
      where: { id: listing.vehicleId },
      data: { status: vehicleStatus },
    });

    await AuditService.log({
      actorId,
      action: `LISTING_${newStatus}`,
      entityType: 'Listing',
      entityId: listingId,
      before: { publicationStatus: listing.publicationStatus },
      after: { publicationStatus: newStatus },
      reason: reason || `Admin updated listing status to ${newStatus}`,
      ip,
    });

    return updatedListing;
  }

  /**
   * Toggle featured slot
   */
  static async setFeatured(adminId: string, listingId: string, featured: boolean, days = 30, ip?: string) {
    const featuredUntil = featured ? new Date(Date.now() + days * 24 * 60 * 60 * 1000) : null;

    const updated = await prisma.listing.update({
      where: { id: listingId },
      data: {
        featured,
        featuredUntil,
      },
    });

    await AuditService.log({
      actorId: adminId,
      action: featured ? 'LISTING_FEATURED' : 'LISTING_UNFEATURED',
      entityType: 'Listing',
      entityId: listingId,
      after: { featured, featuredUntil },
      ip,
    });

    return updated;
  }

  /**
   * Document Verification Action by Admin
   */
  static async verifyDocument(
    adminId: string,
    docId: string,
    status: DocumentStatus,
    rejectionReason?: string,
    ip?: string
  ) {
    const doc = await prisma.vehicleDocument.findUnique({
      where: { id: docId },
    });

    if (!doc) {
      throw new Error('Document not found');
    }

    if (status === DocumentStatus.REJECTED && !rejectionReason) {
      throw new Error('Rejection reason is required when rejecting a document');
    }

    const updated = await prisma.vehicleDocument.update({
      where: { id: docId },
      data: {
        status,
        rejectionReason: status === DocumentStatus.REJECTED ? rejectionReason : null,
        verifiedBy: adminId,
        verifiedAt: new Date(),
      },
    });

    await AuditService.log({
      actorId: adminId,
      action: `DOCUMENT_${status}`,
      entityType: 'VehicleDocument',
      entityId: docId,
      before: { status: doc.status },
      after: { status, rejectionReason },
      reason: rejectionReason || `Document marked as ${status}`,
      ip,
    });

    return updated;
  }

  /**
   * Generate short-lived signed URL for private document viewing (staff only)
   */
  static async getSignedDocumentUrl(staffUserId: string, docId: string, ip?: string) {
    const doc = await prisma.vehicleDocument.findUnique({
      where: { id: docId },
    });

    if (!doc) {
      throw new Error('Document not found');
    }

    const storage = getStorageProvider();
    const signedUrl = await storage.getSignedPrivateUrl(doc.privateStorageKey, 300); // 5 min expiry

    // Audit the document view
    await AuditService.log({
      actorId: staffUserId,
      action: 'VIEWED_PRIVATE_DOCUMENT',
      entityType: 'VehicleDocument',
      entityId: docId,
      reason: `Staff accessed signed URL for docType: ${doc.docType}`,
      ip,
    });

    return signedUrl;
  }
}
