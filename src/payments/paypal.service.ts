// src/payments/paypal.service.ts
import { Injectable } from '@nestjs/common';
import * as paypal from 'paypal-rest-sdk';

@Injectable()
export class PaypalService {
  constructor() {
    paypal.configure({
      mode: process.env.PAYPAL_MODE, // 'sandbox' or 'live'
      client_id: process.env.PAYPAL_CLIENT_ID,
      client_secret: process.env.PAYPAL_CLIENT_SECRET,
    });
  }

  // Create a payment
  createPayment(amount: number) {
    const paymentJson = {
      intent: 'sale',
      payer: { payment_method: 'paypal' },
      redirect_urls: {
        return_url: `${process.env.BASE_URL}/payments/paypal-success`,
        cancel_url: `${process.env.BASE_URL}/payments/paypal-cancel`,
      },
      transactions: [
        {
          amount: {
            total: amount.toFixed(2),
            currency: 'USD',
          },
        },
      ],
    };

    return new Promise((resolve, reject) => {
      paypal.payment.create(paymentJson, function (error, payment) {
        if (error) {
          reject(error);
        } else {
          resolve(payment);
        }
      });
    });
  }

  // Execute the payment
  executePayment(paymentId: string, payerId: string) {
    const paymentJson = { payer_id: payerId };
    return new Promise((resolve, reject) => {
      paypal.payment.execute(paymentId, paymentJson, function (error, payment) {
        if (error) {
          reject(error);
        } else {
          resolve(payment);
        }
      });
    });
  }
}
