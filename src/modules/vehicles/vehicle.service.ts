import prisma from '../core/db';
import {
  VehicleStatus,
  PublicationStatus,
  BusCategory,
  FuelType,
  Transmission,
  AcType,
} from '@prisma/client';
import { getRequiredDocuments } from './vehicle.schema';
import { encryptSensitiveField } from '../core/crypto.service';
import { AuditService } from '../audit/audit.service';

export interface VehicleDraftInput {
  id?: string;
  category?: BusCategory;
  bodyType?: string;
  make?: string;
  model?: string;
  manufactureYear?: number;
  registrationYear?: number;
  registrationNumber?: string;
  chassisNumber?: string;
  fuelType?: FuelType;
  transmission?: Transmission;
  odometerKm?: number;
  seatingCapacity?: number;
  sleeperConfig?: string | null;
  acType?: AcType;
  colour?: string;
  ownersCount?: number;
  permitType?: string | null;
  hypothecated?: boolean;
  insuranceValidTill?: string | Date | null;
  state?: string;
  district?: string;
  city?: string;
  conditionSummary?: string;
  disclosedDefects?: string | null;
  serviceHistory?: string | null;
  askingPrice?: number;
}

export class VehicleService {
  /**
   * Save or update vehicle draft with autosave support
   */
  static async saveDraft(sellerId: string, input: VehicleDraftInput, ip?: string) {
    let cleanReg = input.registrationNumber?.toUpperCase().replace(/[-\s]/g, '');

    // Check unique registration if supplied
    if (cleanReg) {
      const existing = await prisma.vehicle.findFirst({
        where: {
          registrationNumber: cleanReg,
          id: input.id ? { not: input.id } : undefined,
          status: { notIn: [VehicleStatus.ARCHIVED, VehicleStatus.REJECTED] },
        },
      });

      if (existing) {
        throw new Error(`Vehicle with registration ${cleanReg} is already active on SellAnyBus.in`);
      }
    }

    const chassisNumberEnc = input.chassisNumber ? encryptSensitiveField(input.chassisNumber) : undefined;

    if (input.id) {
      // Update existing draft
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: input.id },
      });

      if (!vehicle) {
        throw new Error('Vehicle draft not found');
      }

      if (vehicle.sellerId !== sellerId) {
        throw new Error('IDOR_VIOLATION: Unauthorized access to vehicle');
      }

      const updated = await prisma.vehicle.update({
        where: { id: input.id },
        data: {
          category: input.category || vehicle.category,
          bodyType: input.bodyType || vehicle.bodyType,
          make: input.make || vehicle.make,
          model: input.model || vehicle.model,
          manufactureYear: input.manufactureYear || vehicle.manufactureYear,
          registrationYear: input.registrationYear || vehicle.registrationYear,
          registrationNumber: cleanReg || vehicle.registrationNumber,
          chassisNumberEnc: chassisNumberEnc !== undefined ? chassisNumberEnc : vehicle.chassisNumberEnc,
          fuelType: input.fuelType || vehicle.fuelType,
          transmission: input.transmission || vehicle.transmission,
          odometerKm: input.odometerKm !== undefined ? input.odometerKm : vehicle.odometerKm,
          seatingCapacity: input.seatingCapacity !== undefined ? input.seatingCapacity : vehicle.seatingCapacity,
          sleeperConfig: input.sleeperConfig !== undefined ? input.sleeperConfig : vehicle.sleeperConfig,
          acType: input.acType || vehicle.acType,
          colour: input.colour || vehicle.colour,
          ownersCount: input.ownersCount || vehicle.ownersCount,
          permitType: input.permitType !== undefined ? input.permitType : vehicle.permitType,
          hypothecated: input.hypothecated !== undefined ? input.hypothecated : vehicle.hypothecated,
          insuranceValidTill: input.insuranceValidTill ? new Date(input.insuranceValidTill) : vehicle.insuranceValidTill,
          district: input.district || vehicle.district,
          city: input.city || vehicle.city,
          conditionSummary: input.conditionSummary || vehicle.conditionSummary,
          disclosedDefects: input.disclosedDefects !== undefined ? input.disclosedDefects : vehicle.disclosedDefects,
          serviceHistory: input.serviceHistory !== undefined ? input.serviceHistory : vehicle.serviceHistory,
        },
      });

      // Update asking price on draft listing if provided
      if (input.askingPrice) {
        const slug = `${updated.manufactureYear}-${updated.make}-${updated.model}-${updated.city}-${updated.id.slice(0, 5)}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        await prisma.listing.upsert({
          where: { vehicleId: updated.id },
          create: {
            vehicleId: updated.id,
            slug,
            askingPrice: input.askingPrice,
            publicationStatus: PublicationStatus.DRAFT,
          },
          update: {
            askingPrice: input.askingPrice,
          },
        });
      }

      return updated;
    } else {
      // Create new draft
      if (!cleanReg) {
        cleanReg = `DRAFT-${Date.now()}`;
      }

      const vehicle = await prisma.vehicle.create({
        data: {
          sellerId,
          category: input.category || 'SEATER',
          bodyType: input.bodyType || 'Standard',
          make: input.make || 'Tata',
          model: input.model || 'Standard Bus',
          manufactureYear: input.manufactureYear || 2020,
          registrationYear: input.registrationYear || 2020,
          registrationNumber: cleanReg,
          chassisNumberEnc: chassisNumberEnc || null,
          fuelType: input.fuelType || 'DIESEL',
          transmission: input.transmission || 'MANUAL',
          odometerKm: input.odometerKm || 0,
          seatingCapacity: input.seatingCapacity || 30,
          sleeperConfig: input.sleeperConfig || null,
          acType: input.acType || 'AC',
          colour: input.colour || 'White',
          ownersCount: input.ownersCount || 1,
          permitType: input.permitType || null,
          hypothecated: Boolean(input.hypothecated),
          insuranceValidTill: input.insuranceValidTill ? new Date(input.insuranceValidTill) : null,
          state: 'Odisha',
          district: input.district || 'Khordha',
          city: input.city || 'Bhubaneswar',
          conditionSummary: input.conditionSummary || 'Draft vehicle submission',
          disclosedDefects: input.disclosedDefects || null,
          serviceHistory: input.serviceHistory || null,
          status: VehicleStatus.DRAFT,
        },
      });

      if (input.askingPrice) {
        const slug = `${vehicle.manufactureYear}-${vehicle.make}-${vehicle.model}-${vehicle.city}-${vehicle.id.slice(0, 5)}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        await prisma.listing.create({
          data: {
            vehicleId: vehicle.id,
            slug,
            askingPrice: input.askingPrice,
            publicationStatus: PublicationStatus.DRAFT,
          },
        });
      }

      await AuditService.log({
        actorId: sellerId,
        action: 'VEHICLE_DRAFT_CREATED',
        entityType: 'Vehicle',
        entityId: vehicle.id,
        after: { registrationNumber: cleanReg },
        ip,
      });

      return vehicle;
    }
  }

  /**
   * Submit vehicle for verification and review
   */
  static async submitForVerification(sellerId: string, vehicleId: string, ip?: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        media: true,
        documents: true,
        listing: true,
      },
    });

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    if (vehicle.sellerId !== sellerId) {
      throw new Error('IDOR_VIOLATION: Unauthorized');
    }

    // Validation 1: Min 6 photos required
    const photoCount = vehicle.media.filter((m) => m.type === 'IMAGE').length;
    if (photoCount < 6) {
      throw new Error(`Minimum 6 photos required for verification. Currently uploaded: ${photoCount}`);
    }

    // Validation 2: Dynamic required documents check
    const requiredDocs = getRequiredDocuments({
      hypothecated: vehicle.hypothecated,
      permitType: vehicle.permitType,
      insuranceValidTill: vehicle.insuranceValidTill,
    });

    const uploadedDocTypes = new Set(vehicle.documents.map((d) => d.docType));
    const missingDocs = requiredDocs.filter((reqDoc) => !uploadedDocTypes.has(reqDoc));

    if (missingDocs.length > 0) {
      throw new Error(`Missing required documents: ${missingDocs.join(', ')}`);
    }

    // Update status to SUBMITTED
    const updated = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status: VehicleStatus.SUBMITTED },
    });

    await AuditService.log({
      actorId: sellerId,
      action: 'VEHICLE_SUBMITTED_FOR_VERIFICATION',
      entityType: 'Vehicle',
      entityId: vehicleId,
      before: { status: vehicle.status },
      after: { status: VehicleStatus.SUBMITTED },
      reason: 'Seller submitted vehicle with photos and documents',
      ip,
    });

    return updated;
  }

  /**
   * Seller explicit price approval action
   */
  static async approveSellerPrice(sellerId: string, listingId: string, ip?: string) {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        vehicle: {
          include: {
            valuations: {
              where: { approvalStatus: 'APPROVED' },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    if (!listing) {
      throw new Error('Listing not found');
    }

    if (listing.vehicle.sellerId !== sellerId) {
      throw new Error('IDOR_VIOLATION: Only the owner can approve the asking price');
    }

    const latestValuation = listing.vehicle.valuations[0];
    if (!latestValuation) {
      throw new Error('No approved valuation available for price approval');
    }

    const approvedPrice = latestValuation.recommendedPrice;

    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        sellerApprovedAt: new Date(),
        sellerApprovedPrice: approvedPrice,
        askingPrice: approvedPrice,
      },
    });

    // Advance vehicle status if waiting for seller approval
    if (listing.vehicle.status === VehicleStatus.AWAITING_SELLER_PRICE_APPROVAL) {
      await prisma.vehicle.update({
        where: { id: listing.vehicleId },
        data: { status: VehicleStatus.APPROVED },
      });
    }

    await AuditService.log({
      actorId: sellerId,
      action: 'SELLER_APPROVED_PRICE',
      entityType: 'Listing',
      entityId: listingId,
      after: {
        sellerApprovedPrice: approvedPrice,
        sellerApprovedAt: new Date().toISOString(),
      },
      reason: 'Seller explicitly confirmed recommended asking price',
      ip,
    });

    return updatedListing;
  }

  /**
   * Seller dashboard data retrieval
   */
  static async getSellerDashboard(sellerId: string) {
    const vehicles = await prisma.vehicle.findMany({
      where: { sellerId },
      orderBy: { updatedAt: 'desc' },
      include: {
        media: { where: { isPrimary: true }, take: 1 },
        documents: true,
        inspections: { orderBy: { createdAt: 'desc' }, take: 1 },
        valuations: { orderBy: { createdAt: 'desc' }, take: 1 },
        listing: {
          include: {
            enquiries: {
              orderBy: { createdAt: 'desc' },
              take: 10,
            },
          },
        },
      },
    });

    // Compute status counts
    const statusCounts: Record<string, number> = {
      ALL: vehicles.length,
      DRAFT: 0,
      SUBMITTED: 0,
      UNDER_REVIEW: 0,
      INSPECTION_PENDING: 0,
      APPROVED: 0,
      PUBLISHED: 0,
      SOLD: 0,
      REJECTED: 0,
    };

    vehicles.forEach((v) => {
      if (statusCounts[v.status] !== undefined) {
        statusCounts[v.status]++;
      }
    });

    // Mask buyer phone numbers in enquiries to protect buyer privacy
    const maskedVehicles = vehicles.map((v) => {
      const requiredDocs = getRequiredDocuments({
        hypothecated: v.hypothecated,
        permitType: v.permitType,
        insuranceValidTill: v.insuranceValidTill,
      });

      const uploadedDocTypes = new Set(v.documents.map((d) => d.docType));
      const missingDocs = requiredDocs.filter((rd) => !uploadedDocTypes.has(rd));

      return {
        ...v,
        missingDocs,
        listing: v.listing
          ? {
              ...v.listing,
              enquiries: v.listing.enquiries.map((e) => ({
                id: e.id,
                name: e.name,
                // Mask phone e.g., 98765*****
                phoneMasked: `${e.phone.slice(0, 5)}*****`,
                intendedUse: e.intendedUse,
                timeline: e.timeline,
                message: e.message,
                status: e.status,
                createdAt: e.createdAt,
              })),
            }
          : null,
      };
    });

    return {
      statusCounts,
      vehicles: maskedVehicles,
    };
  }
}
