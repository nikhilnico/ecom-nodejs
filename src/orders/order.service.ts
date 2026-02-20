import { Injectable, NotFoundException } from '@nestjs/common';

export type Order = {
  id: number;
  userId: number;
  items: { productId: number; quantity: number }[];
  paymentIntentId: string;
  status: 'pending' | 'paid';
};

@Injectable()
export class OrderService {
  private readonly orders: Order[] = [];
  private sequence = 1;

  createOrder(payload: Omit<Order, 'id' | 'status'>): Order {
    const order: Order = {
      id: this.sequence++,
      status: 'pending',
      ...payload,
    };

    this.orders.push(order);
    return order;
  }

  getOrdersByUser(userId: number) {
    return this.orders.filter((order) => order.userId === userId);
  }

  getOrderById(id: number) {
    const order = this.orders.find((entry) => entry.id === id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  markPaid(paymentIntentId: string) {
    const order = this.orders.find((entry) => entry.paymentIntentId === paymentIntentId);
    if (!order) {
      return null;
    }

    order.status = 'paid';
    return order;
  }
}
