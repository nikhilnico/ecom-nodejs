import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  // You can add your Redis helper methods here
  getHello(): string {
    return 'Redis service works!';
  }
}
