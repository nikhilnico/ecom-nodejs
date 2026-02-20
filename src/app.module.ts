import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';

import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
// import { RedisModule } from './redis/redis.module';
import { ProductModule } from './products/product.module';
// import { ElasticsearchService } from './products/elasticsearch.service';
// import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as redisStore from 'cache-manager-redis-store';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { CategoryModule } from './category/category.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './orders/order.module';
import { CheckoutModule } from './checkout/checkout.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [redisConfig, databaseConfig],
    }),
    TypeOrmModule.forRoot(databaseConfig()),
    // RedisModule,
    ProductModule,
    AuthModule,
    UsersModule,
    CategoryModule,
    CartModule,
    OrderModule,
    CheckoutModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async (configService: ConfigService): Promise<ThrottlerModuleOptions> => {
        const rateLimitConfig = configService.get('rateLimiting');
        const redisConf = configService.get('redis');

        if (rateLimitConfig?.enabled && redisConf?.enabled) {
          return {
            throttlers: [
              {
                ttl: rateLimitConfig.windowMs,
                limit: rateLimitConfig.maxRequests,
              },
            ],
          };
        }

        return {
          throttlers: [
            {
              ttl: 60000, // 60 seconds in ms
              limit: 100,
            },
          ],
        };
      },
    }),

    // Disabled now
    // ElasticsearchModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     node: config.get('ELASTICSEARCH_URL'),
    //   }),
    // }),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
