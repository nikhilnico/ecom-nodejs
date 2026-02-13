import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service'; // Import ElasticsearchService

@Injectable()
export class ProductService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  // Method to create or update a product and index it in Elasticsearch
  async createOrUpdateProduct(productId: string, productData: any) {
    // Handle product creation logic here
    // Example:
    console.log('Product created or updated:', productData);

    // After creating or updating the product, push it to Elasticsearch
    await this.elasticsearchService.indexProduct(productId, productData);
  }

  // Method to search for products in Elasticsearch
  async searchProducts(query: string, filters: any, page: number, size: number) {
    return await this.elasticsearchService.searchProducts(query, filters, page, size);
  }

  async createProductWithImage(productData: any, imageUrl: string) {
    // Save the product along with the image URL in the DB
    const product = new Product();
    product.name = productData.name;
    product.imageUrl = imageUrl; // Store the S3 URL

    // Save the product to DB
    await product.save();
  }
}
