// src/users/user.service.ts
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity'; // Your User entity
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async setRefreshToken(userId: number, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, { currentHashedRefreshToken: hashedToken });
  }

  async getUserIfRefreshTokenMatches(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.currentHashedRefreshToken) return null;
    const matches = await bcrypt.compare(refreshToken, user.currentHashedRefreshToken);
    return matches ? user : null;
  }
}
