import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(
    @Query('page') page = '1',
    @Query('size') size = '10',
    @Query('sort') sort: 'ASC' | 'DESC' = 'DESC',
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.productService.listProducts({
      page: Number.parseInt(page, 10),
      size: Number.parseInt(size, 10),
      sort,
      minPrice: minPrice !== undefined ? Number.parseFloat(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? Number.parseFloat(maxPrice) : undefined,
      categoryId: categoryId !== undefined ? Number.parseInt(categoryId, 10) : undefined,
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

@Controller('admin/products')
export class AdminProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() body: Partial<any>) {
    return this.productService.createOrUpdateProduct(body);
  }

  @Put(':id')
  async updateProduct(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<any>) {
    return this.productService.createOrUpdateProduct({ ...body, id });
  }
}

@Controller('admin/inventory')
export class AdminInventoryController {
  constructor(private readonly productService: ProductService) {}

  @Get('out-of-stock')
  async outOfStock() {
    return this.productService.getOutOfStockProducts();
  }
}
