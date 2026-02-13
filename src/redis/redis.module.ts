import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service'; // Create Redis service

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        const jobQueueConfig = configService.get('jobQueue');

        if (jobQueueConfig.enabled && redisConfig.enabled) {
          return {
            redis: {
              host: redisConfig.host,
              port: redisConfig.port,
              password: redisConfig.password,
              db: redisConfig.db,
            },
          };
        } else {
          return null;  // Return null if job queue is disabled
        }
      },
    }),
  ],
  providers: [RedisService],
})
export class RedisModule {}
