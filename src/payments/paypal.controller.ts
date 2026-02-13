// src/payments/paypal.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Controller('payments')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  // Create PayPal payment
  @Post('create-paypal-payment')
  async createPaypalPayment(@Body() body: { amount: number }) {
    const payment = await this.paypalService.createPayment(body.amount);
    return { approvalUrl: payment.links.find(link => link.rel === 'approval_url').href };
  }

  // PayPal success URL callback
  @Get('paypal-success')
  async paypalSuccess(@Body() body: { paymentId: string; PayerID: string }) {
    const payment = await this.paypalService.executePayment(body.paymentId, body.PayerID);
    return { payment };
  }

  // PayPal cancel URL callback
  @Get('paypal-cancel')
  async paypalCancel() {
    return { message: 'Payment cancelled' };
  }
}
