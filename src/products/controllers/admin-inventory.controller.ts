import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductService } from '../product.service';

@ApiTags('Admin Inventory')
@Controller('admin/inventory')
export class AdminInventoryController {
  constructor(private readonly productService: ProductService) {}

  @Get('out-of-stock')
  async outOfStock() {
    return this.productService.getOutOfStockProducts();
  }
}