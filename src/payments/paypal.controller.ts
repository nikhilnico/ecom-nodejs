// src/payments/paypal.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { PaypalService } from './paypal.service';

// Define the shape of PayPal payment response
interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

interface PayPalPayment {
  id: string;
  status: string;
  links: PayPalLink[];
}

@Controller('payments')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  // Create PayPal payment
  @Post('create-paypal-payment')
  async createPaypalPayment(@Body() body: { amount: number }) {
    const payment = (await this.paypalService.createPayment(body.amount)) as PayPalPayment;

    // Optional chaining in case link is missing
    const approvalUrl = payment.links.find(link => link.rel === 'approval_url')?.href;

    return { approvalUrl };
  }

  // PayPal success URL callback
  @Get('paypal-success')
  async paypalSuccess(@Body() body: { paymentId: string; PayerID: string }) {
    const payment = (await this.paypalService.executePayment(body.paymentId, body.PayerID)) as PayPalPayment;
    return { payment };
  }

  // PayPal cancel URL callback
  @Get('paypal-cancel')
  async paypalCancel() {
    return { message: 'Payment cancelled' };
  }
}
