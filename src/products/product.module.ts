import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ElasticsearchService } from './elasticsearch.service'; // Import Elasticsearch service

@Module({
  imports: [], // other modules can go here
  controllers: [ProductController],
  providers: [ProductService, ElasticsearchService], // Register ProductService and ElasticsearchService
})
export class ProductModule {}
