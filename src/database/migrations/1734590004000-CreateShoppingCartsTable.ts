import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateShoppingCartsTable1734590004000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cfs_shopping_carts',
        columns: [
          {
            name: 'uuid',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'client_id',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'nvarchar',
            length: '100',
            isNullable: false,
            default: "'active'",
          },
          {
            name: 'session_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'total_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'total_items',
            type: 'int',
            default: 0,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '3',
            default: "'USD'",
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'expires_at',
            type: 'timestamp',
            isNullable: true,
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
      true,
    );

    // Create indexes using raw SQL (MySQL compatible) with existence checks
    const indexes = [
      { name: 'IDX_SHOPPING_CARTS_USER_STATUS', columns: '(user_id, status)' },
      { name: 'IDX_SHOPPING_CARTS_SESSION', columns: '(session_id)' },
      { name: 'IDX_SHOPPING_CARTS_STATUS', columns: '(status)' }
    ];

    for (const index of indexes) {
      const indexExists = await queryRunner.query(`
        SELECT COUNT(*) as count FROM information_schema.STATISTICS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'cfs_shopping_carts' 
        AND INDEX_NAME = '${index.name}'
      `);

      if (indexExists[0].count === 0) {
        await queryRunner.query(`
          CREATE INDEX ${index.name} 
          ON cfs_shopping_carts ${index.columns}
        `);
      }
    }

    // Create foreign key constraint using raw SQL with existence check
    const fkExists = await queryRunner.query(`
      SELECT COUNT(*) as count FROM information_schema.TABLE_CONSTRAINTS 
      WHERE CONSTRAINT_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'cfs_shopping_carts' 
      AND CONSTRAINT_NAME = 'FK_SHOPPING_CARTS_USER' 
      AND CONSTRAINT_TYPE = 'FOREIGN KEY'
    `);

    if (fkExists[0].count === 0) {
      await queryRunner.query(`
        ALTER TABLE cfs_shopping_carts 
        ADD CONSTRAINT FK_SHOPPING_CARTS_USER 
        FOREIGN KEY (user_id) REFERENCES cfs_users(id) 
        ON DELETE CASCADE
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints first (with existence check)
    const fkExists = await queryRunner.query(`
      SELECT COUNT(*) as count FROM information_schema.TABLE_CONSTRAINTS 
      WHERE CONSTRAINT_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'cfs_shopping_carts' 
      AND CONSTRAINT_NAME = 'FK_SHOPPING_CARTS_USER' 
      AND CONSTRAINT_TYPE = 'FOREIGN KEY'
    `);

    if (fkExists[0].count > 0) {
      await queryRunner.query(`
        ALTER TABLE cfs_shopping_carts 
        DROP FOREIGN KEY FK_SHOPPING_CARTS_USER
      `);
    }
    
    // Drop indexes (with existence checks)
    const indexes = ['IDX_SHOPPING_CARTS_USER_STATUS', 'IDX_SHOPPING_CARTS_SESSION', 'IDX_SHOPPING_CARTS_STATUS'];
    
    for (const indexName of indexes) {
      const indexExists = await queryRunner.query(`
        SELECT COUNT(*) as count FROM information_schema.STATISTICS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'cfs_shopping_carts' 
        AND INDEX_NAME = '${indexName}'
      `);

      if (indexExists[0].count > 0) {
        await queryRunner.query(`DROP INDEX ${indexName} ON cfs_shopping_carts`);
      }
    }
    
    // Drop table
    await queryRunner.dropTable('cfs_shopping_carts');
  }
}
