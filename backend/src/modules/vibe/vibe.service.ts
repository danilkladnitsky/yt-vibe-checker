import { LlmService } from '../llm/llm.service';
import type { User } from '@shared/user';
import { YoutubeService } from '../youtube/youtube.service';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { WsEvents } from '@shared/ws';
import path from 'path';
import fs from 'node:fs/promises';

@Injectable()
@WebSocketGateway(8080, { cors: { origin: '*' } })
export class VibeService implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly llmService: LlmService,
    private readonly youtubeService: YoutubeService,
    private readonly authService: AuthService,
  ) {}

  afterInit() {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected', client.id);

    client.on('disconnect', () => {
      console.log('Client disconnected', client.id);
    });
    client.on('error', (error) => {
      console.error('Client error', error);
    });
    client.on('message', (message) => {
      console.log('Client message', message);
    });
    client.on(WsEvents.PING, () => {
      console.log('Client pong');
    });
  }

  private async saveImage(imageContent: string, user: User) {
    try {
      const imagesDir = path.join(__dirname, '..', '..', 'images');
      await fs.mkdir(imagesDir, { recursive: true });

      const fileName = `${user.userId}.${Date.now()}.png`;

      const imagePath = path.join(imagesDir, fileName);
      const HOST_URL = process.env.BACKEND_URL ?? '';

      await fs.writeFile(imagePath, Buffer.from(imageContent, 'base64'));

      return `${HOST_URL}/${fileName}`;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to save image');
    }
  }

  async createVibe(user: User) {
    const accessToken = this.authService.getGoogleAccessToken(user.userId);

    if (!accessToken) {
      throw new Error('No Google access token for user');
    }

    const subscriptions = await this.youtubeService.getSubscriptions(user);

    this.server.emit(WsEvents.YOUTUBE_SUBSCRIPTIONS, subscriptions);

    const subscriptionTitles = subscriptions.map(
      (subscription) => subscription.channelTitle,
    );

    const vibeResponse =
      await this.llmService.generateYoutubeVibeInfo(subscriptionTitles);

    this.server.emit(WsEvents.IMAGE_GENERATION_STARTED, vibeResponse.vibeWords);

    const imageContent = await this.llmService.generateVibeImage(
      vibeResponse.imagePrompt,
    );
    const imageUrl = await this.saveImage(imageContent.images[0], user);

    this.server.emit(WsEvents.IMAGE_GENERATION_RESULT, {
      imageUrl,
      vibeWords: vibeResponse.vibeWords,
    });
  }
}
