import { Controller, Get } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { User } from '@shared/user';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get('subscriptions')
  async getSubscriptions(@CurrentUser() user: User) {
    return this.youtubeService.getSubscriptions(user);
  }
}
