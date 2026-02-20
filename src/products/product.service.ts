import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async createOrUpdateProduct(productData: Partial<Product>): Promise<Product> {
    const product: Product = this.productRepo.create(productData);
    return this.productRepo.save(product);
  }

  async createProductWithImage(productData: Partial<Product>, imageUrl: string): Promise<Product> {
    const product: Product = this.productRepo.create({
      ...productData,
      imageUrl,
    });

    return this.productRepo.save(product);
  }

  async listProducts(params: {
    page?: number;
    size?: number;
    sort?: 'ASC' | 'DESC';
    minPrice?: number;
    maxPrice?: number;
    categoryId?: number;
  }) {
    const page = params.page ?? 1;
    const size = params.size ?? 10;
    const qb = this.productRepo.createQueryBuilder('product');

    if (params.categoryId) {
      qb.andWhere('product.categoryId = :categoryId', { categoryId: params.categoryId });
    }

    if (params.minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice: params.minPrice });
    }

    if (params.maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice: params.maxPrice });
    }

    qb.orderBy('product.id', params.sort ?? 'DESC');

    const [items, total] = await qb.skip((page - 1) * size).take(size).getManyAndCount();

    return { items, total, page, size };
  }

  async getProductById(id: number) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async searchProducts(query: string, filters: any = {}, page = 1, size = 10) {
    const queryBuilder = this.productRepo.createQueryBuilder('product');

    if (query) {
      queryBuilder.where('product.name LIKE :query OR product.description LIKE :query', {
        query: `%${query}%`,
      });
    }

    if (filters.minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters.maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    queryBuilder.skip((page - 1) * size).take(size);

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total, page, size };
  }

  async getOutOfStockProducts() {
    return this.productRepo
      .createQueryBuilder('product')
      .where('product.stock <= 0')
      .getMany();
  }
}
