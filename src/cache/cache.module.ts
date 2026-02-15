// src/cache/cache.module.ts
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'; // <- new import
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        const cachingEnabled = configService.get('caching.enabled');

        if (redisConfig?.enabled && cachingEnabled) {
          return {
            store: redisStore,
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.password,
            db: redisConfig.db,
            ttl: 600,
          };
        }

        return { ttl: 600 }; // fallback to local in-memory cache
      },
    }),
  ],
})
export class AppCacheModule {}
