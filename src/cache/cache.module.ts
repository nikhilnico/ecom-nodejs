import { Module, CacheModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        if (redisConfig.enabled && configService.get('caching.enabled')) {
          return {
            store: redisStore,
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.password,
            db: redisConfig.db,
            ttl: 600,  // Set TTL (Time to Live) in seconds
          };
        } else {
          return {
            ttl: 600,  // Default TTL for local cache
          };
        }
      },
    }),
  ],
})
export class CacheModule {}
