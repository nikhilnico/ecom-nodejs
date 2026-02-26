import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async createOrder(data: {
    userId: number;
    items: { productId: number; quantity: number }[];
    paymentIntentId: string;
  }) {
    let total = 0;
    const orderItems: OrderItem[] = [];

    for (const item of data.items) {
      const product = await this.productRepo.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      // decrease stock
      product.stock -= item.quantity;
      await this.productRepo.save(product);

      const orderItem = new OrderItem();
      orderItem.productId = product.id;
      orderItem.quantity = item.quantity;
      orderItem.price = Number(product.price);

      total += Number(product.price) * item.quantity;

      orderItems.push(orderItem);
    }

    const order = this.orderRepo.create({
      userId: data.userId,
      paymentIntentId: data.paymentIntentId,
      totalAmount: total,
      items: orderItems,
      status: OrderStatus.PENDING,
    });

    return this.orderRepo.save(order);
  }

  async markPaid(paymentIntentId: string) {
    const order = await this.orderRepo.findOne({
      where: { paymentIntentId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = OrderStatus.PAID;
    return this.orderRepo.save(order);
  }

  async getOrdersByUser(userId: number) {
    return this.orderRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
