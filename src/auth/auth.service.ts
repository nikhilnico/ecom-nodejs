import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async register(registerDto: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const existing = await this.usersService.findOne(registerDto.email);
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.createUser({
      ...registerDto,
      password: hashedPassword,
    });

    return this.createSessionTokens(user.id, user.email);
  }

  async createSessionTokens(userId: number, email: string) {
    const accessToken = await this.generateAccessToken(userId, email);
    const refreshToken = await this.generateRefreshToken(userId, email);
    await this.setRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.usersService.getUserIfRefreshTokenMatches(payload.sub, refreshToken);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return {
        accessToken: await this.generateAccessToken(user.id, user.email),
        refreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number) {
    await this.usersService.clearRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }

  async generateAccessToken(userId: number, email: string) {
    const payload = { email, sub: userId };
    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(userId: number, email: string) {
    const payload = { email, sub: userId };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }

  async setRefreshToken(userId: number, refreshToken: string) {
    await this.usersService.setRefreshToken(userId, refreshToken);
  }
}
