import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { ProductRepository } from './product.repository';  
// import { ElasticsearchService } from './elasticsearch.service'; // Import Elasticsearch service

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductRepository])], // other modules can go here
  controllers: [ProductController],
  providers: [ProductService], // Register ProductService and ElasticsearchService
})
export class ProductModule {}
