// src/payments/stripe.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe'; // Default import, not namespace import

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2026-01-28.clover', // Must match SDK type
    });
  }

  // Create a payment intent
  async createPaymentIntent(
    amount: number,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });
    return paymentIntent;
  }
}
