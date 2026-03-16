import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const jwtSchema = z.object({
  secret: z.string().min(1, 'JWT_SECRET is required'),
  expiresIn: z.string().default('7d'),
});

export type JwtConfig = z.infer<typeof jwtSchema>;

export const jwtConfig = registerAs('jwt', (): JwtConfig => {
  const parsed = jwtSchema.safeParse({
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`JWT config validation failed: ${message}`);
  }

  return parsed.data;
});
