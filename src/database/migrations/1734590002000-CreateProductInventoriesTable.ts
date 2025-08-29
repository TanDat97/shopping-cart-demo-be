import { MigrationInterface, QueryRunner, Table, Index, ForeignKey } from 'typeorm';

export class CreateProductInventoriesTable1734590002000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cfs_product_inventories',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'clientId',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'product_sku',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'warehouse_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'quantity_available',
            type: 'int',
            default: 0,
          },
          {
            name: 'quantity_reserved',
            type: 'int',
            default: 0,
          },
          {
            name: 'quantity_sold',
            type: 'int',
            default: 0,
          },
          {
            name: 'reorder_point',
            type: 'int',
            default: 0,
            isNullable: true,
          },
          {
            name: 'version',
            type: 'int',
            default: 0,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'createdBy',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'updatedBy',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'deletedBy',
            type: 'int',
            isNullable: true,
          },
        ],
        indices: [
          {
            name: 'IDX_INVENTORY_PRODUCT_SKU',
            columnNames: ['product_sku'],
          },
          {
            name: 'IDX_INVENTORY_WAREHOUSE_ID',
            columnNames: ['warehouse_id'],
          },
          {
            name: 'IDX_INVENTORY_QUANTITY_AVAILABLE',
            columnNames: ['quantity_available'],
          },
          {
            name: 'IDX_INVENTORY_REORDER_POINT',
            columnNames: ['reorder_point'],
          },
          {
            name: 'IDX_INVENTORY_VERSION',
            columnNames: ['version'],
          },
          {
            name: 'IDX_INVENTORY_PRODUCT_WAREHOUSE',
            columnNames: ['product_sku', 'warehouse_id'],
            isUnique: true,
          },
        ],
        foreignKeys: [
          {
            name: 'FK_INVENTORY_PRODUCT_SKU',
            columnNames: ['product_sku'],
            referencedTableName: 'cfs_products',
            referencedColumnNames: ['sku'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true
    );

    // Add comments to explain the table structure
    await queryRunner.query(`
      ALTER TABLE cfs_product_inventories 
      COMMENT = 'Product inventory management table with optimistic locking'
    `);

    await queryRunner.query(`
      ALTER TABLE cfs_product_inventories 
      MODIFY COLUMN product_sku VARCHAR(100) 
      COMMENT 'Product SKU reference to cfs_products.sku'
    `);

    await queryRunner.query(`
      ALTER TABLE cfs_product_inventories 
      MODIFY COLUMN warehouse_id BIGINT 
      COMMENT 'Warehouse ID, NULL for default warehouse'
    `);

    await queryRunner.query(`
      ALTER TABLE cfs_product_inventories 
      MODIFY COLUMN quantity_available INT 
      COMMENT 'Available quantity for sale'
    `);

    await queryRunner.query(`
      ALTER TABLE cfs_product_inventories 
      MODIFY COLUMN quantity_reserved INT 
      COMMENT 'Reserved quantity for pending orders'
    `);

    await queryRunner.query(`
      ALTER TABLE cfs_product_inventories 
      MODIFY COLUMN quantity_sold INT 
      COMMENT 'Total quantity sold (historical data)'
    `);

    await queryRunner.query(`
      ALTER TABLE cfs_product_inventories 
      MODIFY COLUMN reorder_point INT 
      COMMENT 'Minimum quantity before reorder alert'
    `);

    await queryRunner.query(`
      ALTER TABLE cfs_product_inventories 
      MODIFY COLUMN version INT 
      COMMENT 'Version for optimistic locking'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('cfs_product_inventories');
  }
}

