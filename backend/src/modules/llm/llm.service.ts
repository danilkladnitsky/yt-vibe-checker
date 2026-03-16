import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { OpenrouterConfig } from '../../config/openrouter.config';
import { generateText, Output } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { getVibeCheckPrompt } from './llm.prompt';
import { LLMResponse } from '@shared/llm';

@Injectable()
export class LlmService {
  private readonly openrouterConfig: OpenrouterConfig;

  constructor(private readonly configService: ConfigService) {
    this.openrouterConfig =
      this.configService.getOrThrow<OpenrouterConfig>('openrouter');
  }

  async generateYoutubeVibeInfo(
    subscriptions: string[],
  ): Promise<{ vibeWords: string[]; imagePrompt: string }> {
    try {
      const openrouter = createOpenRouter({
        apiKey: this.openrouterConfig.apiKey,
      });

      const { validationSchema, getPrompt } = getVibeCheckPrompt(subscriptions);

      const prompt = await getPrompt();

      const { output } = await generateText({
        model: openrouter(this.openrouterConfig.textModel),
        output: Output.object({
          schema: validationSchema,
        }),
        prompt,
      });

      return { imagePrompt: output.image_prompt, vibeWords: output.vibe_words };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to generate YouTube vibe info');
    }
  }

  async generateVibeImage(imagePrompt: string) {
    try {
      const openrouter = createOpenRouter({
        apiKey: this.openrouterConfig.apiKey,
      });

      const result = await openrouter
        .imageModel(this.openrouterConfig.imageModel)
        .doGenerate({
          prompt: imagePrompt,
          aspectRatio: '1:1',
          n: 1,
          size: '512x512',
          seed: 42,
          files: [],
          mask: undefined,
          providerOptions: {},
        });

      return result;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to generate YouTube vibe image');
    }
  }
}
