import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ProductService } from '../product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductFilterDto } from '../dto/product-filter-dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async listProducts(@Query() query: ProductFilterDto) {
    // Normalize sort to uppercase
    const sortOrder: 'ASC' | 'DESC' =
    query.sort.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Pass normalized and parsed values to service
    return this.productService.listProducts({
      sort: sortOrder,
      minPrice: Number(query.minPrice),
      maxPrice: Number(query.maxPrice),
      categoryId: query.categoryId ? Number(query.categoryId) : undefined,
    });
  }

  @Get(':id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProductById(id);
  }

  @Get('/search/index')
  async searchProducts(
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

