import { Module } from '@nestjs/common';
import { LlmModule } from '../llm/llm.module';
import { YoutubeModule } from '../youtube/youtube.module';
import { VibeController } from './vibe.controller';
import { VibeService } from './vibe.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [LlmModule, YoutubeModule, AuthModule],
  controllers: [VibeController],
  providers: [VibeService],
})
export class VibeModule {}
