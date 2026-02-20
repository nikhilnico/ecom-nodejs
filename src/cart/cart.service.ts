import { Injectable, NotFoundException } from '@nestjs/common';

export type CartItem = { id: number; productId: number; quantity: number };

@Injectable()
export class CartService {
  private readonly carts = new Map<number, CartItem[]>();
  private sequence = 1;

  getCart(userId: number) {
    return { userId, items: this.carts.get(userId) ?? [] };
  }

  addItem(userId: number, payload: { productId: number; quantity: number }) {
    const items = this.carts.get(userId) ?? [];
    const item: CartItem = { id: this.sequence++, ...payload };
    items.push(item);
    this.carts.set(userId, items);
    return item;
  }

  updateItem(userId: number, id: number, payload: { quantity: number }) {
    const items = this.carts.get(userId) ?? [];
    const item = items.find((entry) => entry.id === id);
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    item.quantity = payload.quantity;
    return item;
  }

  clearCart(userId: number) {
    this.carts.set(userId, []);
  }
}
