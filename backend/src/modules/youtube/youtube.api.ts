import { google, youtube_v3 } from 'googleapis';
import { Injectable } from '@nestjs/common';
import { User } from '@shared/user';
import { AuthService } from '../auth/auth.service';
import { YoutubeSubscription } from '@shared/youtube';

@Injectable()
export class YoutubeApi {
  private readonly youtube: youtube_v3.Youtube;

  constructor(private readonly authService: AuthService) {
    this.youtube = google.youtube('v3');
  }

  /**
   * Returns top subscriptions as YouTube channel URLs (max `maxResults`).
   */
  async getTopSubscriptions(
    user: User,
    maxResults = 5,
  ): Promise<YoutubeSubscription[]> {
    const accessToken = this.authService.getGoogleAccessToken(user.userId);

    if (!accessToken) {
      throw new Error('No Google access token for user');
    }

    const authClient = new google.auth.OAuth2();
    authClient.setCredentials({ access_token: accessToken });

    const response = await this.youtube.subscriptions.list({
      auth: authClient,
      part: ['snippet'],
      mine: true,
      maxResults,
      order: 'relevance',
    });

    const items: youtube_v3.Schema$Subscription[] = response.data.items ?? [];

    return items
      .filter((item) => item.snippet?.channelId)
      .map((item) => ({
        channelId: item.snippet?.channelId ?? '',
        channelTitle: item.snippet?.title ?? '',
        channelThumbnail: item.snippet?.thumbnails?.default?.url ?? '',
        channelUrl: `https://www.youtube.com/channel/${item.snippet?.channelId ?? ''}`,
      }));
  }
}
