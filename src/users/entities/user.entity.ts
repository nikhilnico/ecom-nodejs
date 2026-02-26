import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Cart } from '../../cart/entities/cart.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;  // Store hashed passwords, not plain text

  @Column({
  type: 'text',
    nullable: true,
  })
  currentHashedRefreshToken: string | null;

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

}
