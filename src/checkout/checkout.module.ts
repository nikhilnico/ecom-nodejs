import { Module } from '@nestjs/common';
import { CartModule } from '../cart/cart.module';
import { OrderModule } from '../orders/order.module';
import { CheckoutController } from './checkout.controller';

@Module({
  imports: [CartModule, OrderModule],
  controllers: [CheckoutController],
})
export class CheckoutModule {}
