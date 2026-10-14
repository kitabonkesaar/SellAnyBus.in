import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface StorageProvider {
  uploadPublic(file: Buffer, filename: string, contentType: string): Promise<string>;
  uploadPrivate(file: Buffer, filename: string, contentType: string): Promise<string>;
  getPublicUrl(storageKey: string): string;
  getSignedPrivateUrl(storageKey: string, expiresInSeconds?: number): Promise<string>;
  readPrivateFile(storageKey: string): Promise<Buffer | null>;
}

export class LocalStorageProvider implements StorageProvider {
  private publicDir: string;
  private privateDir: string;
  private signSecret: string;

  constructor() {
    this.publicDir = path.resolve(process.cwd(), 'public/uploads');
    this.privateDir = path.resolve(process.cwd(), 'storage/private_documents');
    this.signSecret = process.env.JWT_ACCESS_SECRET || 'local_storage_secret_key_123';

    // Ensure directories exist
    if (!fs.existsSync(this.publicDir)) {
      fs.mkdirSync(this.publicDir, { recursive: true });
    }
    if (!fs.existsSync(this.privateDir)) {
      fs.mkdirSync(this.privateDir, { recursive: true });
    }
  }

  async uploadPublic(file: Buffer, filename: string, contentType: string): Promise<string> {
    const ext = path.extname(filename) || '.jpg';
    const randomKey = `${crypto.randomUUID()}${ext}`;
    const filePath = path.join(/*turbopackIgnore: true*/ this.publicDir, randomKey);
    fs.writeFileSync(filePath, file);
    return randomKey;
  }

  async uploadPrivate(file: Buffer, filename: string, contentType: string): Promise<string> {
    const ext = path.extname(filename) || '.pdf';
    const randomKey = `${crypto.randomUUID()}${ext}`;
    const filePath = path.join(/*turbopackIgnore: true*/ this.privateDir, randomKey);
    fs.writeFileSync(filePath, file);
    return randomKey;
  }

  getPublicUrl(storageKey: string): string {
    return `/uploads/${storageKey}`;
  }

  async getSignedPrivateUrl(storageKey: string, expiresInSeconds: number = 300): Promise<string> {
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const dataToSign = `${storageKey}:${expiresAt}`;
    const signature = crypto
      .createHmac('sha256', this.signSecret)
      .update(dataToSign)
      .digest('hex');

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${appUrl}/api/v1/documents/view?key=${encodeURIComponent(storageKey)}&expires=${expiresAt}&sig=${signature}`;
  }

  async readPrivateFile(storageKey: string): Promise<Buffer | null> {
    // Prevent directory traversal
    const safeKey = path.basename(storageKey);
    const filePath = path.join(this.privateDir, safeKey);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return fs.readFileSync(filePath);
  }

  verifySignature(storageKey: string, expires: number, signature: string): boolean {
    if (Math.floor(Date.now() / 1000) > expires) {
      return false; // expired
    }
    const safeKey = path.basename(storageKey);
    const expectedSig = crypto
      .createHmac('sha256', this.signSecret)
      .update(`${safeKey}:${expires}`)
      .digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
  }
}

export class S3StorageProvider implements StorageProvider {
  // Stub for AWS S3 / Cloudflare R2
  async uploadPublic(file: Buffer, filename: string, contentType: string): Promise<string> {
    return new LocalStorageProvider().uploadPublic(file, filename, contentType);
  }
  async uploadPrivate(file: Buffer, filename: string, contentType: string): Promise<string> {
    return new LocalStorageProvider().uploadPrivate(file, filename, contentType);
  }
  getPublicUrl(storageKey: string): string {
    return new LocalStorageProvider().getPublicUrl(storageKey);
  }
  async getSignedPrivateUrl(storageKey: string, expiresInSeconds?: number): Promise<string> {
    return new LocalStorageProvider().getSignedPrivateUrl(storageKey, expiresInSeconds);
  }
  async readPrivateFile(storageKey: string): Promise<Buffer | null> {
    return new LocalStorageProvider().readPrivateFile(storageKey);
  }
}

let activeStorageProvider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (!activeStorageProvider) {
    if (process.env.STORAGE_PROVIDER === 's3') {
      activeStorageProvider = new S3StorageProvider();
    } else {
      activeStorageProvider = new LocalStorageProvider();
    }
  }
  return activeStorageProvider;
}
