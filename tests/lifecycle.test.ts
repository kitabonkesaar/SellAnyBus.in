import { describe, it, expect } from 'vitest';
import prisma from '../src/modules/core/db';
import { ListingService } from '../src/modules/listings/listing.service';
import { VehicleService } from '../src/modules/vehicles/vehicle.service';
import { ValuationService } from '../src/modules/valuations/valuation.service';
import { InspectionService } from '../src/modules/inspections/inspection.service';
import { BusCategory, DocumentType, DocumentStatus, InspectionStatus, PublicationStatus } from '@prisma/client';

describe('Listing Lifecycle & Publishing State Machine', () => {
  it('HARD RULE: strictly prevents publishing when required documents are missing or unverified', async () => {
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    const seller = await prisma.user.findFirst({ where: { role: 'SELLER' } });
    expect(admin).toBeDefined();
    expect(seller).toBeDefined();

    // 1. Create a draft vehicle and listing
    const vehicle = await VehicleService.saveDraft(seller!.id, {
      category: BusCategory.SEATER,
      make: 'Tata',
      model: 'Starbus',
      registrationNumber: `OD05TEST${Math.floor(1000 + Math.random() * 9000)}`,
      askingPrice: 1800000,
    });

    const listing = await prisma.listing.findUnique({
      where: { vehicleId: vehicle.id },
    });
    expect(listing).toBeDefined();

    // Attempt to publish immediately: Should FAIL because documents are not verified
    await expect(ListingService.publishListing(admin!.id, listing!.id)).rejects.toThrow(
      'CANNOT_PUBLISH: The following required documents are not VERIFIED'
    );
  });

  it('HARD RULE: strictly prevents publishing when inspection is not APPROVED', async () => {
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    const seller = await prisma.user.findFirst({ where: { role: 'SELLER' } });

    const vehicle = await VehicleService.saveDraft(seller!.id, {
      category: BusCategory.SEATER,
      make: 'Eicher',
      model: 'Skyline',
      registrationNumber: `OD07TEST${Math.floor(1000 + Math.random() * 9000)}`,
      askingPrice: 2000000,
    });

    const listing = await prisma.listing.findUnique({
      where: { vehicleId: vehicle.id },
    });

    // Verify all required documents for this vehicle
    const requiredTypes = [DocumentType.RC, DocumentType.OWNER_ID, DocumentType.FITNESS, DocumentType.TAX, DocumentType.INSURANCE];
    for (const dt of requiredTypes) {
      await prisma.vehicleDocument.create({
        data: {
          vehicleId: vehicle.id,
          sellerId: seller!.id,
          docType: dt,
          privateStorageKey: `test-${dt}.pdf`,
          status: DocumentStatus.VERIFIED,
          verifiedBy: admin!.id,
          verifiedAt: new Date(),
        },
      });
    }

    // Attempt to publish without approved inspection: Should FAIL
    await expect(ListingService.publishListing(admin!.id, listing!.id)).rejects.toThrow(
      'Vehicle inspection is MISSING. Must be APPROVED before publishing.'
    );
  });

  it('HARD RULE: strictly prevents publishing when seller has not approved asking price', async () => {
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    const seller = await prisma.user.findFirst({ where: { role: 'SELLER' } });
    const inspector = await prisma.user.findFirst({ where: { role: 'INSPECTOR' } });

    const vehicle = await VehicleService.saveDraft(seller!.id, {
      category: BusCategory.SEATER,
      make: 'Ashok Leyland',
      model: 'Viking',
      registrationNumber: `OD08TEST${Math.floor(1000 + Math.random() * 9000)}`,
      askingPrice: 2200000,
    });

    const listing = await prisma.listing.findUnique({
      where: { vehicleId: vehicle.id },
    });

    // 1. Verify docs
    const requiredTypes = [DocumentType.RC, DocumentType.OWNER_ID, DocumentType.FITNESS, DocumentType.TAX, DocumentType.INSURANCE];
    for (const dt of requiredTypes) {
      await prisma.vehicleDocument.create({
        data: {
          vehicleId: vehicle.id,
          sellerId: seller!.id,
          docType: dt,
          privateStorageKey: `test-${dt}.pdf`,
          status: DocumentStatus.VERIFIED,
        },
      });
    }

    // 2. Approve inspection
    await prisma.inspection.create({
      data: {
        vehicleId: vehicle.id,
        inspectorId: inspector!.id,
        status: InspectionStatus.APPROVED,
        overallScore: 90,
      },
    });

    // 3. Attempt publish WITHOUT seller price approval: Should FAIL
    await expect(ListingService.publishListing(admin!.id, listing!.id)).rejects.toThrow(
      'Seller has not approved the recommended asking price'
    );
  });

  it('successfully publishes listing when ALL 3 hard rule criteria are satisfied', async () => {
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    const seller = await prisma.user.findFirst({ where: { role: 'SELLER' } });
    const inspector = await prisma.user.findFirst({ where: { role: 'INSPECTOR' } });

    const vehicle = await VehicleService.saveDraft(seller!.id, {
      category: BusCategory.AC_SLEEPER,
      make: 'Volvo',
      model: '9600',
      registrationNumber: `OD09TEST${Math.floor(1000 + Math.random() * 9000)}`,
      askingPrice: 5000000,
    });

    const listing = await prisma.listing.findUnique({
      where: { vehicleId: vehicle.id },
    });

    // 1. Verify all required docs
    const requiredTypes = [DocumentType.RC, DocumentType.OWNER_ID, DocumentType.FITNESS, DocumentType.TAX, DocumentType.INSURANCE];
    for (const dt of requiredTypes) {
      await prisma.vehicleDocument.create({
        data: {
          vehicleId: vehicle.id,
          sellerId: seller!.id,
          docType: dt,
          privateStorageKey: `test-${dt}.pdf`,
          status: DocumentStatus.VERIFIED,
        },
      });
    }

    // 2. Approve inspection
    await prisma.inspection.create({
      data: {
        vehicleId: vehicle.id,
        inspectorId: inspector!.id,
        status: InspectionStatus.APPROVED,
        overallScore: 92,
      },
    });

    // 3. Create approved valuation
    await ValuationService.submitValuation(admin!.id, {
      vehicleId: vehicle.id,
      rangeMin: 4800000,
      rangeMax: 5200000,
      recommendedPrice: 5000000,
    });

    // 4. Seller approves price
    await VehicleService.approveSellerPrice(seller!.id, listing!.id);

    // 5. Admin publishes listing
    const published = await ListingService.publishListing(admin!.id, listing!.id);
    expect(published.publicationStatus).toBe(PublicationStatus.PUBLISHED);

    // Verify vehicle status is updated to PUBLISHED
    const updatedVehicle = await prisma.vehicle.findUnique({ where: { id: vehicle.id } });
    expect(updatedVehicle?.status).toBe('PUBLISHED');
  });
});
