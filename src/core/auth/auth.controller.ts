import { Controller, Request, Post, UseGuards, Body, HttpStatus, HttpException, HttpCode, Get } from '@nestjs/common';

import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { NoJwtGuard } from './no-jwt-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @UseGuards(NoJwtGuard)
  @Post('register')
  async register(@Body() body) {
    await this.authService.register(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('set-role')
  @HttpCode(200)
  async setRole(@Request() req, @Body() body): Promise<{ access_token: string }> {
    const role = body.role;
    return this.authService.setRole(req.user, role);
  }
}
