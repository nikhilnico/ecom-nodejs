import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Search endpoint to search products by query and filters
  @Get('search')
  async searchProducts(
    @Query('query') query: string, // Full-text search query
    @Query('price') price: string, // Filter by price
    @Query('brand') brand: string, // Filter by brand
    @Query('rating') rating: string, // Filter by rating
    @Query('page') page: number = 1, // Pagination: page number
    @Query('size') size: number = 10, // Pagination: number of results per page
  ) {
    // Construct filter object
    const filters = {
      price: price || undefined,
      brand: brand || undefined,
      rating: rating || undefined,
    };

    // Call the service to search products with the query and filters
    const results = await this.productService.searchProducts(query, filters, page, size);
    return {
      results,
      page,
      size,
    };
  }
}
