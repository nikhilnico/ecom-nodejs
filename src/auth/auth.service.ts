// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Validate user and return the user object
  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  // Generate access token
  async generateAccessToken(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return this.jwtService.sign(payload);
  }

  // Generate refresh token
  async generateRefreshToken(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d', // Refresh token expires in 7 days
    });
  }

  // Save refresh token to the user database (optional)
  async setRefreshToken(user: any, refreshToken: string) {
    await this.usersService.setRefreshToken(user.userId, refreshToken);
  }
}
