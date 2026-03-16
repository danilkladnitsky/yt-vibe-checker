import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const openrouterSchema = z.object({
  apiKey: z.string().min(1, 'OPENROUTER_API_KEY is required'),
  textModel: z.string().default('google/gemini-3.1-pro-preview'),
  imageModel: z.string().default('google/gemini-3.1-flash-image-preview'),
});

export type OpenrouterConfig = z.infer<typeof openrouterSchema>;

export const openrouterConfig = registerAs(
  'openrouter',
  (): OpenrouterConfig => {
    const parsed = openrouterSchema.safeParse({
      apiKey: process.env.OPENROUTER_API_KEY,
      textModel: process.env.OPENROUTER_TEXT_MODEL,
      imageModel: process.env.OPENROUTER_IMAGE_MODEL,
    });

    if (!parsed.success) {
      const message = parsed.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('; ');
      throw new Error(`OpenRouter config validation failed: ${message}`);
    }

    return parsed.data;
  },
);
