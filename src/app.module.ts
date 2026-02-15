import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';

import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
import { RedisModule } from './redis/redis.module';
import { ProductModule } from './products/product.module';
import { ElasticsearchService } from './products/elasticsearch.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [redisConfig],
    }),
    TypeOrmModule.forRoot(databaseConfig()),
    RedisModule,
    ProductModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async (configService: ConfigService): Promise<ThrottlerModuleOptions> => {
        const rateLimitConfig = configService.get('rateLimiting');
        const redisConf = configService.get('redis');

        // New structure: ThrottlerModuleOptions is now { throttlers: ThrottlerOptions[] }
        if (rateLimitConfig?.enabled && redisConf?.enabled) {
          return {
            throttlers: [{
              // NOTE: In v5+, TTL is in MILLISECONDS
              ttl: rateLimitConfig.windowMs, 
              limit: rateLimitConfig.maxRequests,
            }],
            // If using a custom storage (like Redis), it sits outside the 'throttlers' array
            // storage: new ThrottlerStorageRedis(redisInstance), 
          };
        }

        return {
          throttlers: [{
            ttl: 60000, // 60 seconds in ms
            limit: 100,
          }],
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ElasticsearchService],
})
export class AppModule {}
