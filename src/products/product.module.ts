import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './controllers/product.controller';
import { AdminProductController } from './controllers/admin-product.controller';
import { AdminInventoryController } from './controllers/admin-inventory.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { ProductRepository } from './product.repository';
import { SearchController } from './search.controller';
// import { ElasticsearchService } from './elasticsearch.service'; // Import Elasticsearch service

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductRepository])],
  controllers: [
    ProductController,
    SearchController,
    AdminProductController,
    AdminInventoryController,
  ],
  providers: [ProductService], // Register ElasticsearchService
  exports: [ProductService],
})
export class ProductModule {}
