import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductService } from '../product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';

@ApiTags('Admin Products')
@Controller('admin/products')
export class AdminProductController {
  constructor(private readonly productService: ProductService) {}

  // Create Product
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Created product', type: Product })
  async createProduct(@Body() body: CreateProductDto) {
    return this.productService.createOrUpdateProduct(body);
  }

  // Update Product
  @Put(':id')
  @ApiOperation({ summary: 'Update an existing product by ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Updated product', type: Product })
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    return this.productService.createOrUpdateProduct({ ...body, id });
  }

  // Delete Product
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({ status: 204, description: 'Deleted successfully' })
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    await this.productService.deleteProduct(id);
    return { message: 'Product deleted successfully' };
  }
}