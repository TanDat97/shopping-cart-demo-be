import { Brackets } from 'typeorm';
import { CoreRepository, ENTITY_REPOSITORY_METADATA } from '@core';
import { ProductInventoryEntity } from './entity';
// import { GetListInventoryDto } from './dto';

@Reflect.metadata(ENTITY_REPOSITORY_METADATA, ProductInventoryEntity)
export class ProductInventoryRepository extends CoreRepository<ProductInventoryEntity> {
  constructor() {
    super();
  }

  /**
   * Build query for listing inventories with filters
   * @param dto GetListInventoryDto
   * @returns QueryBuilder
   */
  getListQuery(dto: any) {
    const query = this.repository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product');

    // Keyword search across product SKU and name
    if (dto.hasKeyword) {
      query.andWhere(
        new Brackets(qb => 
          qb.orWhere('inventory.productSku LIKE :keyword', { keyword: dto.keyword })
            .orWhere('product.name LIKE :keyword', { keyword: dto.keyword })
        )
      );
    }

    // Filter by specific product SKU
    if (dto.productSku) {
      query.andWhere('inventory.productSku LIKE :productSku', { 
        productSku: `%${dto.productSku}%` 
      });
    }

    // Filter by warehouse ID
    if (dto.warehouseId !== undefined) {
      if (dto.warehouseId === null) {
        query.andWhere('inventory.warehouseId IS NULL');
      } else {
        query.andWhere('inventory.warehouseId = :warehouseId', { 
          warehouseId: dto.warehouseId 
        });
      }
    }

    // Filter by stock status
    if (dto.stockStatus) {
      switch (dto.stockStatus) {
        case 'out_of_stock':
          query.andWhere('inventory.quantityAvailable = 0');
          break;
        case 'low_stock':
          query.andWhere('inventory.reorderPoint > 0')
               .andWhere('inventory.quantityAvailable <= inventory.reorderPoint')
               .andWhere('inventory.quantityAvailable > 0');
          break;
        case 'in_stock':
          query.andWhere('inventory.quantityAvailable > 0')
               .andWhere(
                 new Brackets(qb => 
                   qb.where('inventory.reorderPoint = 0')
                     .orWhere('inventory.quantityAvailable > inventory.reorderPoint')
                 )
               );
          break;
      }
    }

    // Default ordering
    query.orderBy('inventory.updatedAt', 'DESC')
         .addOrderBy('inventory.productSku', 'ASC');

    return query;
  }

  /**
   * Find inventory by product SKU and warehouse ID
   * @param productSku Product SKU
   * @param warehouseId Warehouse ID (optional)
   * @returns ProductInventoryEntity or null
   */
  async findByProductAndWarehouse(productSku: string, warehouseId?: number): Promise<ProductInventoryEntity | null> {
    const query = this.repository
      .createQueryBuilder('inventory')
      .where('inventory.productSku = :productSku', { productSku });

    if (warehouseId !== undefined) {
      query.andWhere('inventory.warehouseId = :warehouseId', { warehouseId });
    } else {
      query.andWhere('inventory.warehouseId IS NULL');
    }

    return query.getOne();
  }

  /**
   * Find all inventories for a product across all warehouses
   * @param productSku Product SKU
   * @returns Array of ProductInventoryEntity
   */
  async findByProduct(productSku: string): Promise<ProductInventoryEntity[]> {
    return this.repository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .where('inventory.productSku = :productSku', { productSku })
      .orderBy('inventory.warehouseId', 'ASC')
      .getMany();
  }

  /**
   * Find all inventories for a warehouse
   * @param warehouseId Warehouse ID
   * @returns Array of ProductInventoryEntity
   */
  async findByWarehouse(warehouseId: number): Promise<ProductInventoryEntity[]> {
    return this.repository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .where('inventory.warehouseId = :warehouseId', { warehouseId })
      .orderBy('inventory.productSku', 'ASC')
      .getMany();
  }

  /**
   * Find low stock items
   * @param warehouseId Optional warehouse ID to filter by
   * @returns Array of ProductInventoryEntity with low stock
   */
  async findLowStockItems(warehouseId?: number): Promise<ProductInventoryEntity[]> {
    const query = this.repository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .where('inventory.reorderPoint > 0')
      .andWhere('inventory.quantityAvailable <= inventory.reorderPoint');

    if (warehouseId !== undefined) {
      query.andWhere('inventory.warehouseId = :warehouseId', { warehouseId });
    }

    return query
      .orderBy('inventory.quantityAvailable', 'ASC')
      .getMany();
  }

  /**
   * Find out of stock items
   * @param warehouseId Optional warehouse ID to filter by
   * @returns Array of ProductInventoryEntity with zero stock
   */
  async findOutOfStockItems(warehouseId?: number): Promise<ProductInventoryEntity[]> {
    const query = this.repository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .where('inventory.quantityAvailable = 0');

    if (warehouseId !== undefined) {
      query.andWhere('inventory.warehouseId = :warehouseId', { warehouseId });
    }

    return query
      .orderBy('inventory.updatedAt', 'DESC')
      .getMany();
  }

  /**
   * Get total available quantity for a product across all warehouses
   * @param productSku Product SKU
   * @returns Total available quantity
   */
  async getTotalAvailableQuantity(productSku: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('inventory')
      .select('SUM(inventory.quantityAvailable)', 'total')
      .where('inventory.productSku = :productSku', { productSku })
      .getRawOne();

    return parseInt(result?.total || '0');
  }

  /**
   * Get total reserved quantity for a product across all warehouses
   * @param productSku Product SKU
   * @returns Total reserved quantity
   */
  async getTotalReservedQuantity(productSku: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('inventory')
      .select('SUM(inventory.quantityReserved)', 'total')
      .where('inventory.productSku = :productSku', { productSku })
      .getRawOne();

    return parseInt(result?.total || '0');
  }

  /**
   * Update inventory quantities with optimistic locking
   * @param id Inventory ID
   * @param version Current version for optimistic locking
   * @param quantities Object with quantity updates
   * @returns Updated ProductInventoryEntity
   */
  async updateQuantities(
    id: number,
    version: number,
    quantities: {
      quantityAvailable?: number;
      quantityReserved?: number;
      quantitySold?: number;
    }
  ): Promise<ProductInventoryEntity> {
    const updateResult = await this.repository
      .createQueryBuilder()
      .update(ProductInventoryEntity)
      .set({
        ...quantities,
        version: () => 'version + 1'
      })
      .where('id = :id', { id })
      .andWhere('version = :version', { version })
      .execute();

    if (updateResult.affected === 0) {
      throw new Error('Optimistic lock error: Inventory was modified by another process');
    }

    return this.repository.findOneByOrFail({ id });
  }

  /**
   * Bulk update inventories for multiple products
   * @param updates Array of inventory updates
   * @returns Number of updated records
   */
  async bulkUpdateQuantities(
    updates: Array<{
      productSku: string;
      warehouseId?: number;
      quantityAvailable?: number;
      quantityReserved?: number;
      quantitySold?: number;
    }>
  ): Promise<number> {
    let totalUpdated = 0;

    for (const update of updates) {
      const inventory = await this.findByProductAndWarehouse(update.productSku, update.warehouseId);
      
      if (inventory) {
        await this.repository.update(
          { id: inventory.id },
          {
            quantityAvailable: update.quantityAvailable ?? inventory.quantityAvailable,
            quantityReserved: update.quantityReserved ?? inventory.quantityReserved,
            quantitySold: update.quantitySold ?? inventory.quantitySold
          }
        );
        totalUpdated++;
      }
    }

    return totalUpdated;
  }

  /**
   * Get inventory statistics using query builder
   * @param warehouseId Optional warehouse filter
   * @param productSku Optional product filter
   * @returns Statistics object
   */
  async getInventoryStats(warehouseId?: number, productSku?: string) {
    let query = this.repository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product');

    if (warehouseId !== undefined) {
      query = query.andWhere('inventory.warehouseId = :warehouseId', { warehouseId });
    }

    if (productSku) {
      query = query.andWhere('inventory.productSku = :productSku', { productSku });
    }

    // Get basic counts and sums
    const basicStats = await query
      .select([
        'COUNT(DISTINCT inventory.productSku) as totalProducts',
        'COUNT(DISTINCT inventory.warehouseId) as totalWarehouses',
        'SUM(inventory.quantityAvailable) as totalAvailable',
        'SUM(inventory.quantityReserved) as totalReserved',
        'SUM(inventory.quantitySold) as totalSold',
        'COUNT(*) as totalRecords'
      ])
      .getRawOne();

    // Get low stock count
    const lowStockQuery = query.clone()
      .andWhere('inventory.reorderPoint > 0')
      .andWhere('inventory.quantityAvailable <= inventory.reorderPoint')
      .andWhere('inventory.quantityAvailable > 0');
    
    const lowStockCount = await lowStockQuery.getCount();

    // Get out of stock count
    const outOfStockQuery = query.clone()
      .andWhere('inventory.quantityAvailable = 0');
    
    const outOfStockCount = await outOfStockQuery.getCount();

    return {
      totalProducts: parseInt(basicStats.totalProducts || '0'),
      totalWarehouses: parseInt(basicStats.totalWarehouses || '0'),
      totalRecords: parseInt(basicStats.totalRecords || '0'),
      totalAvailable: parseInt(basicStats.totalAvailable || '0'),
      totalReserved: parseInt(basicStats.totalReserved || '0'),
      totalSold: parseInt(basicStats.totalSold || '0'),
      lowStockCount,
      outOfStockCount,
      inStockCount: parseInt(basicStats.totalRecords || '0') - outOfStockCount
    };
  }
}
