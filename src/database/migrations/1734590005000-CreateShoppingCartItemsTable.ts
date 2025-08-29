import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateShoppingCartItemsTable1734590005000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cfs_shopping_cart_items',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'client_id',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'cart_uuid',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'product_sku',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'discount_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'status',
            type: 'nvarchar',
            length: '100',
            isNullable: false,
            default: "'active'",
          },
          {
            name: 'product_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'product_image',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'added_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'deleted_by',
            type: 'bigint',
            isNullable: true,
          },
        ],
      }),
      true
    );

    // Create indexes using raw SQL (MySQL compatible) with existence checks
    const indexes = [
      { name: 'IDX_CART_ITEMS_CART_PRODUCT_UNIQUE', columns: '(cart_uuid, product_sku)', unique: true },
      { name: 'IDX_CART_ITEMS_CART_STATUS', columns: '(cart_uuid, status)', unique: false },
      { name: 'IDX_CART_ITEMS_PRODUCT_SKU', columns: '(product_sku)', unique: false }
    ];

    for (const index of indexes) {
      const indexExists = await queryRunner.query(`
        SELECT COUNT(*) as count FROM information_schema.STATISTICS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'cfs_shopping_cart_items' 
        AND INDEX_NAME = '${index.name}'
      `);

      if (indexExists[0].count === 0) {
        const uniqueKeyword = index.unique ? 'UNIQUE' : '';
        await queryRunner.query(`
          CREATE ${uniqueKeyword} INDEX ${index.name} 
          ON cfs_shopping_cart_items ${index.columns}
        `);
      }
    }

    // Add check constraints using raw SQL with existence checks
    const checkConstraints = [
      'CHK_CART_ITEMS_QUANTITY_POSITIVE',
      'CHK_CART_ITEMS_PRICE_NON_NEGATIVE', 
      'CHK_CART_ITEMS_DISCOUNT_NON_NEGATIVE'
    ];

    for (const constraintName of checkConstraints) {
      const constraintExists = await queryRunner.query(`
        SELECT COUNT(*) as count FROM information_schema.TABLE_CONSTRAINTS 
        WHERE CONSTRAINT_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'cfs_shopping_cart_items' 
        AND CONSTRAINT_NAME = '${constraintName}' 
        AND CONSTRAINT_TYPE = 'CHECK'
      `);

      if (constraintExists[0].count === 0) {
        let checkExpression = '';
        switch (constraintName) {
          case 'CHK_CART_ITEMS_QUANTITY_POSITIVE':
            checkExpression = 'quantity > 0';
            break;
          case 'CHK_CART_ITEMS_PRICE_NON_NEGATIVE':
            checkExpression = 'price >= 0';
            break;
          case 'CHK_CART_ITEMS_DISCOUNT_NON_NEGATIVE':
            checkExpression = 'discount_amount >= 0';
            break;
        }
        
        await queryRunner.query(`
          ALTER TABLE cfs_shopping_cart_items 
          ADD CONSTRAINT ${constraintName} 
          CHECK (${checkExpression})
        `);
      }
    }

    // Create foreign key constraints using raw SQL with existence checks
    const fkCartExists = await queryRunner.query(`
      SELECT COUNT(*) as count FROM information_schema.TABLE_CONSTRAINTS 
      WHERE CONSTRAINT_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'cfs_shopping_cart_items' 
      AND CONSTRAINT_NAME = 'FK_CART_ITEMS_CART' 
      AND CONSTRAINT_TYPE = 'FOREIGN KEY'
    `);

    if (fkCartExists[0].count === 0) {
      await queryRunner.query(`
        ALTER TABLE cfs_shopping_cart_items 
        ADD CONSTRAINT FK_CART_ITEMS_CART 
        FOREIGN KEY (cart_uuid) REFERENCES cfs_shopping_carts(uuid) 
        ON DELETE CASCADE
      `);
    }

    const fkProductExists = await queryRunner.query(`
      SELECT COUNT(*) as count FROM information_schema.TABLE_CONSTRAINTS 
      WHERE CONSTRAINT_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'cfs_shopping_cart_items' 
      AND CONSTRAINT_NAME = 'FK_CART_ITEMS_PRODUCT' 
      AND CONSTRAINT_TYPE = 'FOREIGN KEY'
    `);

    if (fkProductExists[0].count === 0) {
      await queryRunner.query(`
        ALTER TABLE cfs_shopping_cart_items 
        ADD CONSTRAINT FK_CART_ITEMS_PRODUCT 
        FOREIGN KEY (product_sku) REFERENCES cfs_products(sku) 
        ON DELETE RESTRICT
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints first (with existence checks)
    const foreignKeys = ['FK_CART_ITEMS_CART', 'FK_CART_ITEMS_PRODUCT'];
    
    for (const fkName of foreignKeys) {
      const fkExists = await queryRunner.query(`
        SELECT COUNT(*) as count FROM information_schema.TABLE_CONSTRAINTS 
        WHERE CONSTRAINT_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'cfs_shopping_cart_items' 
        AND CONSTRAINT_NAME = '${fkName}' 
        AND CONSTRAINT_TYPE = 'FOREIGN KEY'
      `);

      if (fkExists[0].count > 0) {
        await queryRunner.query(`
          ALTER TABLE cfs_shopping_cart_items 
          DROP FOREIGN KEY ${fkName}
        `);
      }
    }
    
    // Drop check constraints (with existence checks)
    const checkConstraints = [
      'CHK_CART_ITEMS_QUANTITY_POSITIVE',
      'CHK_CART_ITEMS_PRICE_NON_NEGATIVE', 
      'CHK_CART_ITEMS_DISCOUNT_NON_NEGATIVE'
    ];

    for (const constraintName of checkConstraints) {
      const constraintExists = await queryRunner.query(`
        SELECT COUNT(*) as count FROM information_schema.TABLE_CONSTRAINTS 
        WHERE CONSTRAINT_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'cfs_shopping_cart_items' 
        AND CONSTRAINT_NAME = '${constraintName}' 
        AND CONSTRAINT_TYPE = 'CHECK'
      `);

      if (constraintExists[0].count > 0) {
        await queryRunner.query(`
          ALTER TABLE cfs_shopping_cart_items 
          DROP CHECK ${constraintName}
        `);
      }
    }
    
    // Drop indexes (with existence checks)
    const indexes = ['IDX_CART_ITEMS_CART_PRODUCT_UNIQUE', 'IDX_CART_ITEMS_CART_STATUS', 'IDX_CART_ITEMS_PRODUCT_SKU'];
    
    for (const indexName of indexes) {
      const indexExists = await queryRunner.query(`
        SELECT COUNT(*) as count FROM information_schema.STATISTICS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'cfs_shopping_cart_items' 
        AND INDEX_NAME = '${indexName}'
      `);

      if (indexExists[0].count > 0) {
        await queryRunner.query(`DROP INDEX ${indexName} ON cfs_shopping_cart_items`);
      }
    }
    
    // Drop table
    await queryRunner.dropTable('cfs_shopping_cart_items');
  }
}
