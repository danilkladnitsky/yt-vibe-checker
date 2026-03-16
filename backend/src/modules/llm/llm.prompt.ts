import z from 'zod';
import fs from 'fs';
import path from 'path';

const VIBE_PROMPT_FILE_URL = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'static',
  'prompts',
  'vibe.prompt.txt',
);

export const getVibeCheckPrompt = (subscriptions: string[]) => {
  const validationSchema = z.object({
    vibe_words: z.array(z.string()).min(5).max(5),
    image_prompt: z.string().min(1),
  });

  return {
    validationSchema,
    responseFormat: {
      type: 'json_schema',
      jsonSchema: validationSchema.shape,
    },
    getPrompt: async () => {
      const prompt = await fs.promises.readFile(VIBE_PROMPT_FILE_URL, 'utf8');
      return prompt.replace('XXX', subscriptions.join('\n'));
    },
  };
};
