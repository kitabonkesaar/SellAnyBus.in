import { describe, it, expect } from 'vitest';
import { getRequiredDocuments, INDIAN_REG_REGEX } from '../src/modules/vehicles/vehicle.schema';
import { VehicleService } from '../src/modules/vehicles/vehicle.service';
import { decryptSensitiveField } from '../src/modules/core/crypto.service';
import { DocumentType, BusCategory, VehicleStatus } from '@prisma/client';
import prisma from '../src/modules/core/db';

describe('Seller Vehicle Onboarding & Rules', () => {
  it('validates Indian vehicle registration format correctly', () => {
    expect(INDIAN_REG_REGEX.test('OD02AB1234')).toBe(true);
    expect(INDIAN_REG_REGEX.test('OD14E5678')).toBe(true);
    expect(INDIAN_REG_REGEX.test('INVALID_NUMBER')).toBe(false);
  });

  it('calculates dynamic required documents according to circumstances', () => {
    // Normal bus without loan
    const standardDocs = getRequiredDocuments({ hypothecated: false, permitType: null });
    expect(standardDocs).toContain(DocumentType.RC);
    expect(standardDocs).toContain(DocumentType.INSURANCE);
    expect(standardDocs).toContain(DocumentType.FITNESS);
    expect(standardDocs).not.toContain(DocumentType.NOC_HYPOTHECATION);

    // Hypothecated bus must require NOC / Lien release
    const hypothecatedDocs = getRequiredDocuments({ hypothecated: true, permitType: 'Stage Carriage' });
    expect(hypothecatedDocs).toContain(DocumentType.NOC_HYPOTHECATION);
    expect(hypothecatedDocs).toContain(DocumentType.PERMIT);
  });

  it('creates and updates a vehicle draft with encrypted chassis number', async () => {
    const seller = await prisma.user.findFirst({ where: { role: 'SELLER' } });
    expect(seller).toBeDefined();

    const draft = await VehicleService.saveDraft(seller!.id, {
      category: BusCategory.AC_SLEEPER,
      bodyType: 'Luxury Sleeper Coach',
      make: 'Volvo',
      model: '9600 Sleeper',
      manufactureYear: 2023,
      registrationYear: 2023,
      registrationNumber: `OD02TEST${Math.floor(1000 + Math.random() * 9000)}`,
      chassisNumber: 'VOLVO-CHASSIS-SECRET-999',
      askingPrice: 5500000,
    });

    expect(draft.id).toBeDefined();
    expect(draft.status).toBe(VehicleStatus.DRAFT);
    expect(draft.chassisNumberEnc).toBeDefined();

    // Verify chassis is encrypted at rest and decrypts accurately
    const decrypted = decryptSensitiveField(draft.chassisNumberEnc!);
    expect(decrypted).toBe('VOLVO-CHASSIS-SECRET-999');
  });

  it('enforces IDOR protection when another user attempts to edit a vehicle', async () => {
    const sellers = await prisma.user.findMany({ where: { role: 'SELLER' }, take: 2 });
    expect(sellers.length).toBeGreaterThanOrEqual(2);

    const [sellerA, sellerB] = sellers;

    const draftA = await VehicleService.saveDraft(sellerA.id, {
      category: BusCategory.SEATER,
      make: 'Tata',
      model: 'Ultra 36',
      registrationNumber: `OD01IDOR${Math.floor(1000 + Math.random() * 9000)}`,
    });

    // Seller B attempts to edit Seller A's draft
    await expect(
      VehicleService.saveDraft(sellerB.id, {
        id: draftA.id,
        make: 'HackedMake',
      })
    ).rejects.toThrow('IDOR_VIOLATION');
  });

  it('rejects vehicle submission if minimum 6 photos are not provided', async () => {
    const seller = await prisma.user.findFirst({ where: { role: 'SELLER' } });
    const draft = await VehicleService.saveDraft(seller!.id, {
      category: BusCategory.STAFF_BUS,
      make: 'Eicher',
      model: 'Starline',
      registrationNumber: `OD03FAIL${Math.floor(1000 + Math.random() * 9000)}`,
    });

    // Attempt submission with 0 photos
    await expect(VehicleService.submitForVerification(seller!.id, draft.id)).rejects.toThrow(
      'Minimum 6 photos required'
    );
  });
});
