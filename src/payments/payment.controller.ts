// src/payments/payment.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly stripeService: StripeService) {}

  // Endpoint to create a Stripe payment intent
  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: { amount: number }) {
    const paymentIntent = await this.stripeService.createPaymentIntent(body.amount);
    return { clientSecret: paymentIntent.client_secret }; // Send the client secret to the frontend
  }
}
