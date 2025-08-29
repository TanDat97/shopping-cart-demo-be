import { Brackets } from 'typeorm';
import { CoreRepository, ENTITY_REPOSITORY_METADATA } from '@core';
import { GetListProductDto } from './dto';
import { ProductEntity } from './entity';

@Reflect.metadata(ENTITY_REPOSITORY_METADATA, ProductEntity)
export class ProductRepository extends CoreRepository<ProductEntity> {
  constructor() {
    super();
  }
  
  getListQuery(dto: GetListProductDto) {
    const query = this.repository.createQueryBuilder('product');

    if (dto.hasKeyword) {
      query.andWhere(
        new Brackets(qb => 
          qb.orWhere('product.name LIKE :keyword', { keyword: dto.keyword })
            .orWhere('product.sku LIKE :keyword', { keyword: dto.keyword })
        )
      );
    }

    if (dto.status) {
      query.andWhere('product.status = :status', { status: dto.status });
    }

    if (dto.sku) {
      query.andWhere('product.sku LIKE :sku', { sku: `%${dto.sku}%` });
    }

    if (dto.name) {
      query.andWhere('product.name LIKE :name', { name: `%${dto.name}%` });
    }

    return query;
  }

  findDuplicate(id: number, sku: string) {
    const query = this.repository
      .createQueryBuilder('product')
      .select(['product.id', 'product.sku'])
      .where('LOWER(product.sku) = LOWER(:sku)', { sku });

    if (id) {
      query.andWhere('product.id != :id', { id });
    } else {
      query.andWhere('product.id IS NOT NULL');
    }

    return query;
  }
}
