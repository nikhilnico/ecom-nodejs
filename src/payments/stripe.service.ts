// src/payments/stripe.service.ts
import { Injectable } from '@nestjs/common';
import * as Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2020-08-27',
    });
  }

  // Create a payment intent for a given amount
  async createPaymentIntent(amount: number): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: 'usd', // Specify currency (change as needed)
    });
  }
}
