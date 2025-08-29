import { Entity, Column, ManyToOne, JoinColumn, Index, VersionColumn } from 'typeorm';
import { CoreEntity } from '@core/core.entity';
import { ProductEntity } from '../products/entity';

@Entity({ name: 'cfs_product_inventories' })
@Index(['productSku', 'warehouseId'], { unique: true })
export class ProductInventoryEntity extends CoreEntity {
  @Column({ name: 'product_sku', type: 'varchar', length: 100 })
  productSku: string;

  @Column({ name: 'warehouse_id', type: 'bigint', nullable: true })
  warehouseId: number;

  @Column({ name: 'quantity_available', type: 'int', default: 0 })
  quantityAvailable: number;

  @Column({ name: 'quantity_reserved', type: 'int', default: 0 })
  quantityReserved: number;

  @Column({ name: 'quantity_sold', type: 'int', default: 0 })
  quantitySold: number;

  @Column({ name: 'reorder_point', type: 'int', default: 0, nullable: true })
  reorderPoint: number;

  @VersionColumn({ name: 'version', type: 'int', default: 0 })
  version: number;

  // Relations
  @ManyToOne(() => ProductEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_sku', referencedColumnName: 'sku' })
  product: ProductEntity;

  // Computed properties
  get totalQuantity(): number {
    return this.quantityAvailable + this.quantityReserved;
  }

  get isLowStock(): boolean {
    return this.reorderPoint > 0 && this.quantityAvailable <= this.reorderPoint;
  }

  get stockStatus(): 'in_stock' | 'low_stock' | 'out_of_stock' {
    if (this.quantityAvailable === 0) {
      return 'out_of_stock';
    }
    if (this.isLowStock) {
      return 'low_stock';
    }
    return 'in_stock';
  }
}
