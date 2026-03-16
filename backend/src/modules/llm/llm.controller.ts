import { Body, Controller, Post } from '@nestjs/common';
import { LlmService } from './llm.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { llmServiceMock } from './llm.service.mock';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('youtube-vibe-check')
  @ApiOperation({ summary: 'Generate YouTube vibe check' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        subscriptions: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of YouTube subscriptions',
        },
      },
    },
  })
  @ApiResponse({ status: 200, type: Object })
  async generateYoutubeVibeCheck(@Body() body: { subscriptions: string[] }) {
    // return this.llmService.generateYoutubeVibeCheck(body.subscriptions);
    return llmServiceMock.generateYoutubeVibeCheck();
  }
}
