import { Entity, Column, ManyToOne, JoinColumn, Index, Check } from 'typeorm';
import { CoreEntity } from '@core/core.entity';
import { EnumColumn } from '@libraries/typeorm';
import { CartItemStatus } from '@core/interfaces';
import { ShoppingCartEntity } from '../shopping-carts/entity';
import { ProductEntity } from '../products/entity';

@Entity({ name: 'cfs_shopping_cart_items' })
@Index(['cartUuid', 'productSku'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['cartUuid', 'status'], { where: 'deleted_at IS NULL' })
@Check('quantity > 0')
export class ShoppingCartItemEntity extends CoreEntity {
  @Column({ name: 'cart_uuid', type: 'varchar', length: 36 })
  cartUuid: string;

  @Column({ name: 'product_sku', type: 'varchar', length: 100 })
  productSku: string;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @EnumColumn()
  status: CartItemStatus;

  @Column({ name: 'product_name', type: 'varchar', length: 255 })
  productName: string;

  @Column({ name: 'product_image', type: 'varchar', length: 500, nullable: true })
  productImage?: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'added_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  addedAt: Date;

  // Relations
  @ManyToOne(() => ShoppingCartEntity, cart => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_uuid', referencedColumnName: 'uuid' })
  cart: ShoppingCartEntity;

  @ManyToOne(() => ProductEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_sku', referencedColumnName: 'sku' })
  product: ProductEntity;

  // Computed properties
  get totalPrice(): number {
    return this.price * this.quantity - this.discountAmount;
  }

  get unitPriceAfterDiscount(): number {
    if (this.quantity === 0) return this.price;
    return this.totalPrice / this.quantity;
  }

  get isActive(): boolean {
    return this.status === CartItemStatus.ACTIVE;
  }

  get hasDiscount(): boolean {
    return this.discountAmount > 0;
  }

  // Methods
  updateQuantity(newQuantity: number): void {
    if (newQuantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    this.quantity = newQuantity;
  }

  applyDiscount(amount: number): void {
    if (amount < 0) {
      throw new Error('Discount amount cannot be negative');
    }
    if (amount > this.price * this.quantity) {
      throw new Error('Discount amount cannot exceed total price');
    }
    this.discountAmount = amount;
  }

  markAsRemoved(): void {
    this.status = CartItemStatus.REMOVED;
  }

  markAsActive(): void {
    this.status = CartItemStatus.ACTIVE;
  }
}
