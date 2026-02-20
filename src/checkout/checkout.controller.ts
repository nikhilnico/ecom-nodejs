import { Body, Controller, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { getRequestUserId } from '../common/request-user.util';
import { CartService } from '../cart/cart.service';
import { OrderService } from '../orders/order.service';

@Controller()
export class CheckoutController {
  constructor(
    private readonly cartService: CartService,
    private readonly orderService: OrderService,
  ) {}

  @Post('checkout')
  checkout(@Req() request: Request, @Body() body: { paymentProvider: string }) {
    const userId = getRequestUserId(request);
    const cart = this.cartService.getCart(userId);
    const paymentIntentId = `${body.paymentProvider ?? 'provider'}-${Date.now()}`;

    const order = this.orderService.createOrder({
      userId,
      items: cart.items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      paymentIntentId,
    });

    this.cartService.clearCart(userId);

    return {
      order,
      paymentIntent: {
        id: paymentIntentId,
        provider: body.paymentProvider ?? 'mock',
      },
    };
  }

  @Post('webhooks/payment')
  paymentWebhook(@Body() body: { paymentIntentId: string; event: string }) {
    if (body.event === 'payment.succeeded') {
      return {
        acknowledged: true,
        order: this.orderService.markPaid(body.paymentIntentId),
      };
    }

    return { acknowledged: true };
  }
}
