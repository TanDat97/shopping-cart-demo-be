import { DataSource } from 'typeorm';
import configs from '../configs';
import { ProductEntity } from '../components/products/entity';
import { ShoppingCartEntity } from '@components/shopping-carts/entity';
import { ShoppingCartItemEntity } from '@components/shopping-cart-items/entity';

export const myDataSource = new DataSource({
  type: 'mysql',
  host: configs.database.host,
  port: parseInt(configs.database.port),
  username: configs.database.username,
  password: configs.database.password,
  database: configs.database.database,
  synchronize: configs.database.synchronize == 'true',
  logging: configs.database.logging == 'true',
  entities: [ProductEntity, ShoppingCartEntity, ShoppingCartItemEntity],
  driver: require('mysql2'),
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrationsRun: true,
  ssl: configs.database.ssl == 'true',
});
