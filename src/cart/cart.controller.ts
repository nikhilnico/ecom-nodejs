import { Body, Controller, Get, Patch, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { CartService } from './cart.service';
import { getRequestUserId } from '../common/request-user.util';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() request: Request) {
    return this.cartService.getCart(getRequestUserId(request));
  }

  @Post('items')
  addItem(
    @Req() request: Request,
    @Body() payload: { productId: number; quantity: number },
  ) {
    return this.cartService.addItem(getRequestUserId(request), payload);
  }

  @Patch('items/:id')
  updateItem(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: { quantity: number },
  ) {
    return this.cartService.updateItem(getRequestUserId(request), id, payload);
  }
}
