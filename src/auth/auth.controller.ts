import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { getRequestUserId } from '../common/request-user.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: { firstName: string; lastName: string; email: string; password: string },
  ) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      return { message: 'Invalid credentials' };
    }

    return this.authService.createSessionTokens(user.id, user.email);
  }

  @Post('refresh')
  async refreshToken(@Body() payload: { refreshToken: string }) {
    return this.authService.refreshAccessToken(payload.refreshToken);
  }

  @Post('logout')
  async logout(@Req() request: Request) {
    const userId = getRequestUserId(request);
    return this.authService.logout(userId);
  }

  @Get('oauth/facebook/callback')
  async facebookCallback() {
    return {
      provider: 'facebook',
      message: 'Facebook OAuth callback handled',
    };
  }
}
