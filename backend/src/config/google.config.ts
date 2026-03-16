import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const googleSchema = z.object({
  clientId: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  clientSecret: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
  callbackUrl: z.string().min(1, 'GOOGLE_CALLBACK_URL is required'),
  frontendUrl: z.string().min(1, 'FRONTEND_URL is required'),
});

export type GoogleConfig = z.infer<typeof googleSchema>;

export const googleConfig = registerAs('google', (): GoogleConfig => {
  const parsed = googleSchema.safeParse({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    frontendUrl: process.env.FRONTEND_URL,
  });

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Google config validation failed: ${message}`);
  }

  return parsed.data;
});
