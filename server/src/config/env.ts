import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((v) => parseInt(v, 10)),
  NODE_ENV: z.string().default('development'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/aura_db?schema=public'),
  AUTH_SECRET: z.string().default('aura_secure_jwt_secret_dev_key_2026'),
  // Server-only admin allowlists - NEVER exposed to frontend
  ADMIN_EMAIL_ALLOWLIST: z.string().default('dhilipanmurugesan705@gmail.com'),
  ADMIN_PHONE_ALLOWLIST: z.string().default('6369605540'),
  // AI Provider configuration
  LLM_PROVIDER: z.string().default('dev'),
  LLM_API_KEY: z.string().default(''),
  STT_PROVIDER: z.string().default('dev'),
  STT_API_KEY: z.string().default(''),
  TTS_PROVIDER: z.string().default('dev'),
  TTS_API_KEY: z.string().default(''),
  EMBEDDING_PROVIDER: z.string().default('dev'),
  EMBEDDING_API_KEY: z.string().default(''),
});

export const env = envSchema.parse(process.env);

// Helper to check if an email or phone is authorized for administrative privileges
export function isAuthorizedAdmin(identifier: { email?: string; phoneNumber?: string }): boolean {
  const allowedEmails = env.ADMIN_EMAIL_ALLOWLIST.split(',').map((e) => e.trim().toLowerCase());
  const allowedPhones = env.ADMIN_PHONE_ALLOWLIST.split(',').map((p) => p.replace(/\D/g, ''));

  if (identifier.email && allowedEmails.includes(identifier.email.trim().toLowerCase())) {
    return true;
  }

  if (identifier.phoneNumber) {
    const cleanPhone = identifier.phoneNumber.replace(/\D/g, '');
    // Check either full 10-12 digit match
    if (allowedPhones.some((p) => cleanPhone.endsWith(p))) {
      return true;
    }
  }

  return false;
}
