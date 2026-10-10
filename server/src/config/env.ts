import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().optional().default('postgresql://postgres:postgres@localhost:5432/postgres'),
  JWT_SECRET: z.string().default('freshguard-ai-default-jwt-secret-key-2026'),
  INITIAL_MANAGER_SETUP_SECRET: z.string().default('987654321'),
  EMAIL_PROVIDER_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('FreshGuard AI <notifications@freshguard.ai>'),
  APP_BASE_URL: z.string().default('https://freshguard-ai-henna.vercel.app'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Γ¥î Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
