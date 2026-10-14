import prisma from '../core/db';
import { Prisma } from '@prisma/client';

export interface AuditLogInput {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  reason?: string | null;
  ip?: string | null;
}

export class AuditService {
  /**
   * Append-only audit logger for compliance and tracking
   */
  static async log(input: AuditLogInput) {
    try {
      return await prisma.auditLog.create({
        data: {
          actorId: input.actorId || null,
          action: input.action,
          entityType: input.entityType,
          entityId: input.entityId,
          before: input.before ? (input.before as Prisma.InputJsonValue) : Prisma.JsonNull,
          after: input.after ? (input.after as Prisma.InputJsonValue) : Prisma.JsonNull,
          reason: input.reason || null,
          ip: input.ip || null,
        },
      });
    } catch (error) {
      console.error('[AuditService] Failed to write audit log:', error);
      return null;
    }
  }

  static async getLogs(filters?: {
    entityType?: string;
    entityId?: string;
    actorId?: string;
    action?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where: Prisma.AuditLogWhereInput = {};
    if (filters?.entityType) where.entityType = filters.entityType;
    if (filters?.entityId) where.entityId = filters.entityId;
    if (filters?.actorId) where.actorId = filters.actorId;
    if (filters?.action) where.action = filters.action;

    const total = await prisma.auditLog.count({ where });
    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      include: {
        actor: {
          select: { id: true, name: true, phone: true, email: true, role: true },
        },
      },
    });

    return { total, page, pageSize, logs };
  }
}
