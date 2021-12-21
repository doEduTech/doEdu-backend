import { Controller, Request, Post, UseGuards, Body, HttpStatus, HttpException } from '@nestjs/common';

import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { NoJwtGuard } from './no-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @UseGuards(NoJwtGuard)
  @Post('register')
  async register(@Body() body) {
    try {
      await this.authService.register(body.email, body.password);
    } catch (e) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
