import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config'; // Import the database config

import { ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from './redis/redis.module'; // Create RedisModule
import redisConfig from './config/redis.config';

import { ElasticsearchService } from './elasticsearch.service'; // Adjust the path

import { ProductModule } from './products/product.module'; // Import ProductModule


@Module({
  providers: [ElasticsearchService],

  imports: [
    ProductModule,
    TypeOrmModule.forRoot(databaseConfig()),  // Add the config here
    ConfigModule.forRoot({
      load: [redisConfig],  // Load Redis config
    }),
    RedisModule,

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const rateLimitConfig = configService.get('rateLimiting');
        const redisConfig = configService.get('redis');

        if (rateLimitConfig.enabled && redisConfig.enabled) {
          return {
            ttl: rateLimitConfig.windowMs / 1000, // Convert ms to seconds
            limit: rateLimitConfig.maxRequests,
            store: new RedisStore({
              host: redisConfig.host,
              port: redisConfig.port,
              password: redisConfig.password,
              db: redisConfig.db,
            }),
          };
        } else {
          return { ttl: 60, limit: 100 };  // Fallback to default values if Redis is not enabled
        }
      },
    }),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
