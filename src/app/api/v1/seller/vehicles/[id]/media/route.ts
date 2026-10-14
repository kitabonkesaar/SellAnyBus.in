import { NextResponse } from 'next/server';
import { requireAuth, requireSellerOwnership } from '@/modules/auth/guard';
import { getStorageProvider } from '@/modules/core/providers/storage.provider';
import prisma from '@/modules/core/db';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;
    await requireSellerOwnership(id, session.userId);

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const isPrimary = formData.get('isPrimary') === 'true';

    if (!file) {
      return NextResponse.json({ error: { code: 'NO_FILE', message: 'No file provided' } }, { status: 400 });
    }

    // Size limit 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: { code: 'FILE_TOO_LARGE', message: 'Maximum file size is 10MB' } }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const storage = getStorageProvider();
    const storageKey = await storage.uploadPublic(buffer, file.name, file.type);

    const count = await prisma.vehicleMedia.count({ where: { vehicleId: id } });

    // If marked primary, unset other primaries
    if (isPrimary || count === 0) {
      await prisma.vehicleMedia.updateMany({
        where: { vehicleId: id },
        data: { isPrimary: false },
      });
    }

    const media = await prisma.vehicleMedia.create({
      data: {
        vehicleId: id,
        type: file.type.startsWith('video') ? 'VIDEO' : 'IMAGE',
        storageKey,
        position: count,
        isPrimary: isPrimary || count === 0,
        visibility: 'PUBLIC',
      },
    });

    return NextResponse.json({
      success: true,
      media: {
        ...media,
        url: storage.getPublicUrl(storageKey),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Media upload failed';
    return NextResponse.json({ error: { code: 'UPLOAD_FAILED', message } }, { status: 400 });
  }
}
