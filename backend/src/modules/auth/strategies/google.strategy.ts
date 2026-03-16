import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

export interface GoogleProfile {
  id: string;
  displayName: string;
  name?: { givenName?: string; familyName?: string };
  emails?: Array<{ value: string; verified?: boolean }>;
  photos?: Array<{ value: string }>;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') ?? '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') ?? '',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') ?? '',
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/youtube.readonly',
      ],
      passReqToCallback: false,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<void> {
    const user = await this.authService.validateOrCreateGoogleUser(profile);
    this.authService.setGoogleTokens(
      String(user.userId),
      accessToken,
      refreshToken,
    );
    done(null, user);
  }
}
