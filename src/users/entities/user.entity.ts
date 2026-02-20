import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

}
