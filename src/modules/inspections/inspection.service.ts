import prisma from '../core/db';
import { InspectionStatus, VehicleStatus, Prisma } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

export interface InspectionChecklistData {
  engine: { status: 'PASSED' | 'FAILED' | 'NOT_VERIFIED'; note: string };
  transmission: { status: 'PASSED' | 'FAILED' | 'NOT_VERIFIED'; note: string };
  clutch: { status: 'PASSED' | 'FAILED' | 'NOT_VERIFIED'; note: string };
  brakes: { status: 'PASSED' | 'FAILED' | 'NOT_VERIFIED'; note: string };
  suspension: { status: 'PASSED' | 'FAILED' | 'NOT_VERIFIED'; note: string };
  steering: { status: 'PASSED' | 'FAILED' | 'NOT_VERIFIED'; note: string };
  tyres: { status: 'PASSED' | 'FAILED' | 'NOT_VERIFIED'; note: string };
  electrical: { status: 'PASSED' | 'FAILED' | 'NOT_VERIFIED'; note: string };
  acSystem: { status: 'PASSED' | 'FAILED' | 'NOT_VERIFIED'; note: string };
  bodyChassis: { status: 'PASSED' | 'FAILED' | 'NOT_VERIFIED'; note: string };
  interiorSeats: { status: 'PASSED' | 'FAILED' | 'NOT_VERIFIED'; note: string };
  emergencyExits: { status: 'PASSED' | 'FAILED' | 'NOT_VERIFIED'; note: string };
  lights: { status: 'PASSED' | 'FAILED' | 'NOT_VERIFIED'; note: string };
  documentsMatch: { status: 'PASSED' | 'FAILED' | 'NOT_VERIFIED'; note: string };
}

export class InspectionService {
  static async getInspectorQueue(inspectorId: string) {
    return await prisma.inspection.findMany({
      where: { inspectorId },
      orderBy: { scheduledAt: 'asc' },
      include: {
        vehicle: {
          include: {
            media: { where: { isPrimary: true }, take: 1 },
          },
        },
      },
    });
  }

  static async submitInspection(
    inspectorId: string,
    inspectionId: string,
    data: {
      checklistResults: InspectionChecklistData;
      overallScore: number;
      summary: string;
      photos?: { storageKey: string; caption?: string }[];
    },
    ip?: string
  ) {
    const inspection = await prisma.inspection.findUnique({
      where: { id: inspectionId },
      include: { vehicle: true },
    });

    if (!inspection) {
      throw new Error('Inspection not found');
    }

    if (inspection.inspectorId && inspection.inspectorId !== inspectorId) {
      throw new Error('Unauthorized: You are not assigned to this inspection');
    }

    const updated = await prisma.inspection.update({
      where: { id: inspectionId },
      data: {
        checklistResults: data.checklistResults as unknown as Prisma.InputJsonValue,
        overallScore: data.overallScore,
        summary: data.summary,
        status: InspectionStatus.SUBMITTED,
        submittedAt: new Date(),
        photos: data.photos
          ? {
              create: data.photos.map((p) => ({
                storageKey: p.storageKey,
                caption: p.caption,
              })),
            }
          : undefined,
      },
    });

    await prisma.vehicle.update({
      where: { id: inspection.vehicleId },
      data: { status: VehicleStatus.INSPECTED },
    });

    await AuditService.log({
      actorId: inspectorId,
      action: 'INSPECTION_SUBMITTED',
      entityType: 'Inspection',
      entityId: inspectionId,
      after: { overallScore: data.overallScore, status: InspectionStatus.SUBMITTED },
      reason: 'Inspector submitted checklist and valuation recommendation',
      ip,
    });

    return updated;
  }

  static async approveInspection(adminId: string, inspectionId: string, ip?: string) {
    const inspection = await prisma.inspection.findUnique({
      where: { id: inspectionId },
    });

    if (!inspection) {
      throw new Error('Inspection not found');
    }

    const updated = await prisma.inspection.update({
      where: { id: inspectionId },
      data: {
        status: InspectionStatus.APPROVED,
        approvedAt: new Date(),
        approvedBy: adminId,
      },
    });

    await AuditService.log({
      actorId: adminId,
      action: 'INSPECTION_APPROVED',
      entityType: 'Inspection',
      entityId: inspectionId,
      after: { status: InspectionStatus.APPROVED },
      reason: 'Admin approved inspector report',
      ip,
    });

    return updated;
  }
}
