import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index, PrimaryGeneratedColumn, } from 'typeorm';
import { EnumColumn } from '@libraries/typeorm';
import { CartStatus } from '@core/interfaces';
import { UserEntity } from '../users/entity';
import { CoreEntityNoId } from '@core';
import { ShoppingCartItemEntity } from '@components/shopping-cart-items/entity';

@Entity({ name: 'cfs_shopping_carts' })
@Index(['userId', 'status'], { where: 'deleted_at IS NULL' })
export class ShoppingCartEntity extends CoreEntityNoId {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ nullable: true, length: 100 })
  clientId?: string;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @EnumColumn()
  status: CartStatus;

  @Column({ name: 'session_id', type: 'varchar', length: 255, nullable: true })
  sessionId?: string;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ name: 'total_items', type: 'int', default: 0 })
  totalItems: number;

  @Column({ name: 'currency', type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt?: Date;

  // Relations
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => ShoppingCartItemEntity, (item) => item.cart, { cascade: true })
  items: ShoppingCartItemEntity[];

  // Computed properties
  get isActive(): boolean {
    return this.status === CartStatus.ACTIVE;
  }

  get isExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }

  get isEmpty(): boolean {
    return this.totalItems === 0;
  }

  // Methods
  calculateTotals(items: any[]): void {
    this.totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    this.totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  markAsAbandoned(): void {
    this.status = CartStatus.ABANDONED;
  }

  markAsCheckout(): void {
    this.status = CartStatus.CHECKOUT;
  }

  markAsCompleted(): void {
    this.status = CartStatus.COMPLETED;
  }
}
