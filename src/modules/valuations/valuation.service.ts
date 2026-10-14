import prisma from '../core/db';
import { ValuationStatus, VehicleStatus, Prisma } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

export interface CreateValuationInput {
  vehicleId: string;
  rangeMin: number;
  rangeMax: number;
  recommendedPrice: number;
  comparables?: { make: string; model: string; year: number; soldPrice: number }[];
  factors?: {
    odometerScore?: string;
    conditionScore?: number;
    marketDemand?: string;
    refurbishmentCost?: number;
  };
}

export class ValuationService {
  /**
   * Create or update indicative price valuation for vehicle
   */
  static async submitValuation(adminId: string, input: CreateValuationInput, ip?: string) {
    if (input.rangeMin <= 0 || input.rangeMax < input.rangeMin) {
      throw new Error('Invalid price range: rangeMax must be greater than rangeMin');
    }

    if (input.recommendedPrice < input.rangeMin || input.recommendedPrice > input.rangeMax) {
      throw new Error('Recommended asking price must fall within the indicative range (min–max)');
    }

    const valuation = await prisma.valuation.create({
      data: {
        vehicleId: input.vehicleId,
        rangeMin: input.rangeMin,
        rangeMax: input.rangeMax,
        recommendedPrice: input.recommendedPrice,
        comparables: input.comparables as unknown as Prisma.InputJsonValue,
        factors: input.factors as unknown as Prisma.InputJsonValue,
        reviewedBy: adminId,
        approvalStatus: ValuationStatus.APPROVED,
      },
    });

    // Advance vehicle to AWAITING_SELLER_PRICE_APPROVAL
    await prisma.vehicle.update({
      where: { id: input.vehicleId },
      data: { status: VehicleStatus.AWAITING_SELLER_PRICE_APPROVAL },
    });

    await AuditService.log({
      actorId: adminId,
      action: 'VALUATION_SUBMITTED_AND_APPROVED',
      entityType: 'Valuation',
      entityId: valuation.id,
      after: {
        rangeMin: input.rangeMin,
        rangeMax: input.rangeMax,
        recommendedPrice: input.recommendedPrice,
      },
      reason: 'Admin approved indicative valuation; vehicle awaiting seller price approval',
      ip,
    });

    return valuation;
  }
}
