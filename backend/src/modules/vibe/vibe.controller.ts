import { Controller, Post, UseGuards } from '@nestjs/common';
import type { User } from '@shared/user';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtGuard } from 'src/guards/jwt.guard';
import { VibeService } from './vibe.service';

@Controller('vibe')
export class VibeController {
  constructor(private readonly vibeService: VibeService) {}

  @Post('create')
  @UseGuards(JwtGuard)
  async createVibe(@CurrentUser() user: User) {
    this.vibeService.createVibe(user);

    return { message: 'Vibe creation started' };
  }
}
