import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { User } from '@shared/user';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() req: { user: User },
    @Res() res: Response,
  ): Promise<void> {
    const { access_token } = await this.authService.login(req.user);
    const frontendUrl = this.configService.get<string>('google.frontendUrl');
    const redirectUrl = `${frontendUrl}/auth/callback#access_token=${access_token}`;
    res.redirect(redirectUrl);
  }
}
