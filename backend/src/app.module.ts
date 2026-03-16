import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { openrouterConfig } from './config/openrouter.config';
import { AuthModule } from './modules/auth/auth.module';
import { jwtConfig } from './config/jwt.config';
import { googleConfig } from './config/google.config';
import { YoutubeModule } from './modules/youtube/youtube.module';
import { HealthModule } from './modules/health/health.module';
import { VibeModule } from './modules/vibe/vibe.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';

export const IMAGES_DIR = path.join(__dirname, '..', 'images');

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: IMAGES_DIR,
      renderPath: '/images/:path',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [openrouterConfig, jwtConfig, googleConfig],
    }),
    AuthModule,
    YoutubeModule,
    HealthModule,
    VibeModule,
  ],
})
export class AppModule {}
