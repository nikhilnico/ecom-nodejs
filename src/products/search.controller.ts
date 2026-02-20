import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('search')
export class SearchController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async search(
    @Query('q') query: string,
    @Query('page') page = '1',
    @Query('size') size = '10',
  ) {
    return this.productService.searchProducts(
      query,
      {},
      Number.parseInt(page, 10),
      Number.parseInt(size, 10),
    );
  }
}
