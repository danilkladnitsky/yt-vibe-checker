import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@shared/user';
import { UsersService } from '../users/users.service';
import type { GoogleProfile } from './strategies/google.strategy';

@Injectable()
export class AuthService {
  private static readonly googleTokens = new Map<
    string,
    { accessToken: string; refreshToken?: string }
  >();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateOrCreateGoogleUser(profile: GoogleProfile): Promise<User> {
    const existing = await this.usersService.findOne(profile.id);
    if (existing) return existing;

    const user: User = {
      userId: profile.id,
      name: profile.displayName ?? '',
      email: profile.emails?.[0]?.value ?? '',
    };
    return this.usersService.create(user);
  }

  setGoogleTokens(
    userId: string,
    accessToken: string,
    refreshToken?: string,
  ): void {
    AuthService.googleTokens.set(userId, { accessToken, refreshToken });
  }

  getGoogleAccessToken(userId: string): string | undefined {
    return AuthService.googleTokens.get(userId)?.accessToken;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { sub: user.userId, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }
}
