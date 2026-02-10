import jwt from "jsonwebtoken";
import crypto from "crypto";

const ENC_ALGO = "aes-256-gcm";
const IV_LENGTH = 12; // recommended for GCM
const AUTH_TAG_LENGTH = 16;

function getKey(): Buffer {
  const keySource =
    process.env.TOKEN_ENCRYPTION_KEY ||
    process.env.JWT_SECRET ||
    "default_secret_key_change_me";
  // Derive 32-byte key using scrypt for consistent length
  return crypto.scryptSync(keySource, "salt", 32);
}

export function generateToken(userId: string, expiresIn = "7d"): string {
  const secret = (process.env.JWT_SECRET || "changeme") as jwt.Secret;
  const options = { expiresIn } as jwt.SignOptions;
  return jwt.sign({ userId }, secret, options);
}

export function encryptToken(token: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ENC_ALGO, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(token, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // Format: base64(iv | authTag | ciphertext)
  const out = Buffer.concat([iv, authTag, encrypted]);
  return out.toString("base64");
}

export function decryptToken(encryptedBase64: string): string {
  const input = Buffer.from(encryptedBase64, "base64");
  const iv = input.slice(0, IV_LENGTH);
  const authTag = input.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = input.slice(IV_LENGTH + AUTH_TAG_LENGTH);

  const key = getKey();
  const decipher = crypto.createDecipheriv(ENC_ALGO, key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
