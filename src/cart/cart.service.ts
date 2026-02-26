import { Injectable, NotFoundException } from '@nestjs/common';

export type CartItem = {
  id: number;
  productId: number;
  quantity: number;
};

@Injectable()
export class CartService {
  private readonly carts = new Map<number, CartItem[]>();
  private sequence = 1;

  getCart(userId: number) {
    const items = this.carts.get(userId) ?? [];

    return {
      userId,
      items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }

  addItem(userId: number, payload: { productId: number; quantity: number }) {
    const items = this.carts.get(userId) ?? [];

    // If product already exists -> increase quantity
    const existingItem = items.find(
      (item) => item.productId === payload.productId,
    );

    if (existingItem) {
      existingItem.quantity += payload.quantity;
      return existingItem;
    }

    const item: CartItem = {
      id: this.sequence++,
      productId: payload.productId,
      quantity: payload.quantity,
    };

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

  removeItem(userId: number, id: number) {
    const items = this.carts.get(userId) ?? [];

    const index = items.findIndex((entry) => entry.id === id);
    if (index === -1) {
      throw new NotFoundException('Cart item not found');
    }

    items.splice(index, 1);
    this.carts.set(userId, items);

    return { message: 'Item removed successfully' };
  }

  clearCart(userId: number) {
    this.carts.set(userId, []);
    return { message: 'Cart cleared successfully' };
  }
}
