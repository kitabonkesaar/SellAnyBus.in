import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const envKey = process.env.APP_ENCRYPTION_KEY || 'dev_32_byte_hex_key_for_encrypt_0123456789abcdef0123456789abcdef';
  // Return exactly 32 bytes
  return crypto.createHash('sha256').update(envKey).digest();
}

/**
 * Encrypt sensitive plain text (e.g., chassis numbers, owner Aadhaar)
 */
export function encryptSensitiveField(text: string): string {
  if (!text) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Combine iv + tag + encrypted as base64
  const combined = Buffer.concat([iv, tag, encrypted]);
  return combined.toString('base64');
}

/**
 * Decrypt sensitive field
 */
export function decryptSensitiveField(ciphertextBase64: string): string {
  if (!ciphertextBase64) return '';
  try {
    const combined = Buffer.from(ciphertextBase64, 'base64');
    if (combined.length < IV_LENGTH + TAG_LENGTH) return '';

    const iv = combined.subarray(0, IV_LENGTH);
    const tag = combined.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const encrypted = combined.subarray(IV_LENGTH + TAG_LENGTH);

    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  } catch {
    return '[Decryption Failed]';
  }
}

/**
 * Hash IP / Phone for privacy-preserving deduplication
 */
export function hashIdentifier(input: string): string {
  const salt = process.env.JWT_ACCESS_SECRET || 'salt_sellanybus';
  return crypto.createHmac('sha256', salt).update(input).digest('hex');
}
