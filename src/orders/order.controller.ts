import { Controller, Get, Param, ParseIntPipe, Req } from '@nestjs/common';
import type { Request } from 'express';
import { getRequestUserId } from '../common/request-user.util';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getOrders(@Req() request: Request) {
    return this.orderService.getOrdersByUser(getRequestUserId(request));
  }

  @Get(':id')
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrderById(id);
  }
}
