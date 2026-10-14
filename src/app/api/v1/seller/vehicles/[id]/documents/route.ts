import { NextResponse } from 'next/server';
import { requireAuth, requireSellerOwnership } from '@/modules/auth/guard';
import { getStorageProvider } from '@/modules/core/providers/storage.provider';
import prisma from '@/modules/core/db';
import { DocumentType, DocumentStatus } from '@prisma/client';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;
    await requireSellerOwnership(id, session.userId);

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const docTypeStr = formData.get('docType') as string;
    const expiresAtStr = formData.get('expiresAt') as string | null;

    if (!file || !docTypeStr) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'File and docType are required' } },
        { status: 400 }
      );
    }

    const docType = docTypeStr as DocumentType;
    if (!Object.values(DocumentType).includes(docType)) {
      return NextResponse.json({ error: { code: 'INVALID_DOCTYPE', message: 'Invalid document type' } }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: { code: 'FILE_TOO_LARGE', message: 'Maximum file size is 10MB' } }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const storage = getStorageProvider();
    const privateStorageKey = await storage.uploadPrivate(buffer, file.name, file.type);

    const expiresAt = expiresAtStr ? new Date(expiresAtStr) : null;

    // Upsert document of this type for the vehicle
    const existing = await prisma.vehicleDocument.findFirst({
      where: { vehicleId: id, docType },
    });

    let document;
    if (existing) {
      document = await prisma.vehicleDocument.update({
        where: { id: existing.id },
        data: {
          privateStorageKey,
          status: DocumentStatus.PENDING,
          rejectionReason: null,
          expiresAt,
        },
      });
    } else {
      document = await prisma.vehicleDocument.create({
        data: {
          vehicleId: id,
          sellerId: session.userId,
          docType,
          privateStorageKey,
          status: DocumentStatus.PENDING,
          expiresAt,
        },
      });
    }

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        docType: document.docType,
        status: document.status,
        expiresAt: document.expiresAt,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Document upload failed';
    return NextResponse.json({ error: { code: 'UPLOAD_FAILED', message } }, { status: 400 });
  }
}
