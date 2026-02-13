// src/auth/auth.controller.ts
import { Controller, Post, Body, Req, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from '../users/user.service';
import { RefreshTokenGuard } from './refresh-token.guard'; // Optional for refreshing tokens
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }, @Res() res: Response) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);

    // Store refresh token in a httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Send access token in response body
    return res.json({ accessToken });
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshToken(@Req() req: any, @Res() res: Response) {
    const user = req.user; // User will be injected via the RefreshTokenGuard
    const newAccessToken = await this.authService.generateAccessToken(user);
    return res.json({ accessToken: newAccessToken });
  }
}
