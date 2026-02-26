import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  // One cart per user (recommended)
  @ManyToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Foreign key column
  userId: number;

  @OneToMany(() => CartItem, (item) => item.cart, {
    cascade: true,
    eager: true, // auto-load items with cart
  })
  items: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
