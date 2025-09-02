import { CoreRepository, ENTITY_REPOSITORY_METADATA } from '@core';
import { ShoppingCartEntity } from './entity';
import { GetCartDto } from './dto';
import { SelectQueryBuilder } from 'typeorm';
import { CartStatus } from '@core/interfaces';

@Reflect.metadata(ENTITY_REPOSITORY_METADATA, ShoppingCartEntity)
export class ShoppingCartRepository extends CoreRepository<ShoppingCartEntity> {
  constructor() {
    super();
  }

  getListQuery(dto: GetCartDto): SelectQueryBuilder<ShoppingCartEntity> {
    const query = this.repository.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.items', 'items')
      .leftJoinAndSelect('cart.user', 'user')
      .where('cart.deletedAt IS NULL');

    if (dto.uuid) {
      query.andWhere('cart.uuid = :uuid', { uuid: dto.uuid });
    }

    if (dto.userId) {
      query.andWhere('cart.userId = :userId', { userId: dto.userId });
    }

    if (dto.status) {
      query.andWhere('cart.status = :status', { status: dto.status });
    }

    query.orderBy('cart.updatedAt', 'DESC');
    return query;
  }

  async findActiveCartByUser(userId: number): Promise<ShoppingCartEntity | null> {
    return this.findOne({
      where: {
        userId,
        status: CartStatus.ACTIVE
      },
      relations: ['items', 'items.product']
    });
  }

  async findCartByUuid(uuid: string): Promise<ShoppingCartEntity | null> {
    return this.findOne({
      where: { uuid },
      relations: ['items', 'items.product', 'user']
    });
  }
}
