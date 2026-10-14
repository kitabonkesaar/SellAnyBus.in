import { NextResponse } from 'next/server';
import { getStorageProvider, LocalStorageProvider } from '@/modules/core/providers/storage.provider';
import path from 'path';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const key = url.searchParams.get('key');
    const expires = parseInt(url.searchParams.get('expires') || '0', 10);
    const sig = url.searchParams.get('sig');

    if (!key || !expires || !sig) {
      return new NextResponse('Invalid document request parameters', { status: 400 });
    }

    const storage = getStorageProvider() as LocalStorageProvider;
    if (typeof storage.verifySignature === 'function') {
      const isValid = storage.verifySignature(key, expires, sig);
      if (!isValid) {
        return new NextResponse('Signed URL has expired or signature is invalid', { status: 403 });
      }
    }

    const fileBuffer = await storage.readPrivateFile(key);
    if (!fileBuffer) {
      return new NextResponse('Document file not found', { status: 404 });
    }

    const ext = path.extname(key).toLowerCase();
    let contentType = 'application/pdf';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${path.basename(key)}"`,
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: unknown) {
    return new NextResponse('Error loading secure document', { status: 500 });
  }
}
