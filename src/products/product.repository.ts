// src/products/product.repository.ts
import { EntityRepository, Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  // Add any custom methods if needed
}
