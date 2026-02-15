import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ElasticsearchService } from './elasticsearch.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async createOrUpdateProduct(productData: Partial<Product>): Promise<Product> {
    const product: Product = this.productRepo.create(productData);
    const saved = await this.productRepo.save(product);
    await this.elasticsearchService.indexProduct(saved.id.toString(), saved);
    return saved;
  }

  async createProductWithImage(productData: Partial<Product>, imageUrl: string): Promise<Product> {
    const product: Product = this.productRepo.create({
      ...productData,
      imageUrl,
    });

    const saved = await this.productRepo.save(product);
    await this.elasticsearchService.indexProduct(saved.id.toString(), saved);
    return saved;
  }

  async searchProducts(query: string, filters: any = {}, page = 1, size = 10) {
    return await this.elasticsearchService.searchProducts(query, filters, page, size);
  }
}
