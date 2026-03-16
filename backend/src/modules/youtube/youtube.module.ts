import { Module } from '@nestjs/common';
import { YoutubeController } from './yotube.controller';
import { YoutubeService } from './youtube.service';
import { YoutubeApi } from './youtube.api';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [YoutubeController],
  providers: [YoutubeService, YoutubeApi],
  exports: [YoutubeService],
})
export class YoutubeModule {}
