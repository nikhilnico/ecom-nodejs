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
  async checkout(
    @Req() request: Request,
    @Body() body: { paymentProvider: string },
  ) {
    const userId = getRequestUserId(request);
    const cart = await this.cartService.getCart(userId);

    if (!cart.items.length) {
      throw new Error('Cart is empty');
    }

    const paymentIntentId = `${body.paymentProvider ?? 'mock'}-${Date.now()}`;

    const order = await this.orderService.createOrder({
      userId,
      items: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      paymentIntentId,
    });

    await this.cartService.clearCart(userId);

    return {
      order,
      paymentIntent: {
        id: paymentIntentId,
        provider: body.paymentProvider ?? 'mock',
      },
    };
  }

  @Post('webhooks/payment')
  async paymentWebhook(
    @Body() body: { paymentIntentId: string; event: string },
  ) {
    if (body.event === 'payment.succeeded') {
      return {
        acknowledged: true,
        order: await this.orderService.markPaid(body.paymentIntentId),
      };
    }

    return { acknowledged: true };
  }
}
