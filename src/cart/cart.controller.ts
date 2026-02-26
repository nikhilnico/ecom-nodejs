import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { CartService } from './cart.service';
import { getRequestUserId } from '../common/request-user.util';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  getCart(@Req() request: Request) {
    return this.cartService.getCart(getRequestUserId(request));
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  addItem(
    @Req() request: Request,
    @Body() payload: AddCartItemDto,
  ) {
    return this.cartService.addItem(
      getRequestUserId(request),
      payload,
    );
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  updateItem(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(
      getRequestUserId(request),
      id,
      payload,
    );
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove item from cart' })
  removeItem(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.cartService.removeItem(
      getRequestUserId(request),
      id,
    );
  }

  @Delete()
  @ApiOperation({ summary: 'Clear entire cart' })
  clearCart(@Req() request: Request) {
    return this.cartService.clearCart(
      getRequestUserId(request),
    );
  }
}
