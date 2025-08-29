import { Entity, Column } from 'typeorm';
import { CoreEntity } from '@core/core.entity';
import { EnumColumn } from '@libraries/typeorm';
import { ProductStatus } from '@core/interfaces';

export interface IProductImage {
  thumbnail?: string;
  mobile?: string;
  tablet?: string;
  desktop?: string;
}

@Entity({ name: 'cfs_products' })
export class ProductEntity extends CoreEntity {
  @Column({ length: 100, unique: true })
  sku: string;

  @Column({ length: 255 })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @EnumColumn()
  status: ProductStatus;

  @Column({ length: 100, nullable: true })
  category: string;

  @Column({ type: 'json', nullable: true })
  images: IProductImage;

  @Column({ type: 'text', nullable: true })
  description: string;
}
