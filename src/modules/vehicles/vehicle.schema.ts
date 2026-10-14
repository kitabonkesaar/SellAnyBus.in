import { z } from 'zod';
import { BusCategory, FuelType, Transmission, AcType, DocumentType } from '@prisma/client';

// Indian vehicle registration regex (e.g., OD02AB1234 or OD-02-AB-1234)
export const INDIAN_REG_REGEX = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/;

export const VehicleStep1Schema = z.object({
  category: z.nativeEnum(BusCategory),
  bodyType: z.string().min(2, 'Body type is required'),
  registrationNumber: z
    .string()
    .transform((val) => val.toUpperCase().replace(/[-\s]/g, ''))
    .refine((val) => INDIAN_REG_REGEX.test(val), {
      message: 'Invalid Indian registration format (e.g. OD02AB1234)',
    }),
  chassisNumber: z.string().optional(),
});

export const VehicleStep2Schema = z.object({
  make: z.string().min(2, 'Make is required'),
  model: z.string().min(2, 'Model is required'),
  manufactureYear: z.number().int().min(2000).max(new Date().getFullYear()),
  registrationYear: z.number().int().min(2000).max(new Date().getFullYear()),
  sleeperConfig: z.string().optional().nullable(),
});

export const VehicleStep3Schema = z.object({
  seatingCapacity: z.number().int().min(10).max(100),
  fuelType: z.nativeEnum(FuelType).default(FuelType.DIESEL),
  transmission: z.nativeEnum(Transmission).default(Transmission.MANUAL),
  odometerKm: z.number().int().min(0).max(2000000),
  acType: z.nativeEnum(AcType).default(AcType.AC),
  colour: z.string().min(2, 'Colour is required'),
  conditionSummary: z.string().min(10, 'Please provide a condition summary'),
  disclosedDefects: z.string().optional().nullable(),
  serviceHistory: z.string().optional().nullable(),
});

export const VehicleStep4Schema = z.object({
  ownersCount: z.number().int().min(1).max(10).default(1),
  district: z.string().min(2, 'District is required'),
  city: z.string().min(2, 'City is required'),
  permitType: z.string().optional().nullable(),
  hypothecated: z.boolean().default(false),
  insuranceValidTill: z.string().optional().nullable(),
});

export const VehicleStep5Schema = z.object({
  askingPrice: z.number().int().min(100000, 'Minimum asking price is ₹1,00,000'),
  reasonForSale: z.string().optional().nullable(),
});

/**
 * Determine required documents dynamically based on vehicle circumstances
 */
export function getRequiredDocuments(data: {
  hypothecated?: boolean;
  permitType?: string | null;
  insuranceValidTill?: string | Date | null;
}): DocumentType[] {
  const required: DocumentType[] = [
    DocumentType.RC,
    DocumentType.OWNER_ID,
    DocumentType.FITNESS,
    DocumentType.TAX,
  ];

  // Insurance required
  required.push(DocumentType.INSURANCE);

  // Permit required if commercial route or tourist permit is declared
  if (data.permitType) {
    required.push(DocumentType.PERMIT);
  }

  // NOC / Lien release required ONLY if bus is hypothecated to bank/financier
  if (data.hypothecated) {
    required.push(DocumentType.NOC_HYPOTHECATION);
  }

  return required;
}
