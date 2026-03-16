import { Injectable } from '@nestjs/common';
import { YoutubeApi } from './youtube.api';
import { User } from '@shared/user';

@Injectable()
export class YoutubeService {
  constructor(private readonly youtubeApi: YoutubeApi) {}

  async getSubscriptions(user: User) {
    const subscriptions = await this.youtubeApi.getTopSubscriptions(user, 5);

    return subscriptions;
  }
}
