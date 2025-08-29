import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedProductsData1734590003000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Product data to import
    const products = [
      {
        id: 1,
        sku: 'WAFFLE-001',
        name: 'Waffle with Berries',
        category: 'Waffle',
        price: 6.50,
        status: 'active',
        description: 'Delicious waffle topped with fresh berries',
        images: JSON.stringify({
          thumbnail: 'https://orderfoodonline.deno.dev/public/images/image-waffle-thumbnail.jpg',
          mobile: 'https://orderfoodonline.deno.dev/public/images/image-waffle-mobile.jpg',
          tablet: 'https://orderfoodonline.deno.dev/public/images/image-waffle-tablet.jpg',
          desktop: 'https://orderfoodonline.deno.dev/public/images/image-waffle-desktop.jpg'
        })
      },
      {
        id: 2,
        sku: 'CREME-001',
        name: 'Vanilla Bean Crème Brûlée',
        category: 'Crème Brûlée',
        price: 7.00,
        status: 'active',
        description: 'Classic French dessert with vanilla bean and caramelized sugar',
        images: JSON.stringify({
          thumbnail: 'https://orderfoodonline.deno.dev/public/images/image-creme-brulee-thumbnail.jpg',
          mobile: 'https://orderfoodonline.deno.dev/public/images/image-creme-brulee-mobile.jpg',
          tablet: 'https://orderfoodonline.deno.dev/public/images/image-creme-brulee-tablet.jpg',
          desktop: 'https://orderfoodonline.deno.dev/public/images/image-creme-brulee-desktop.jpg'
        })
      },
      {
        id: 3,
        sku: 'MACARON-001',
        name: 'Macaron Mix of Five',
        category: 'Macaron',
        price: 8.00,
        status: 'active',
        description: 'Assorted pack of five colorful French macarons',
        images: JSON.stringify({
          thumbnail: 'https://orderfoodonline.deno.dev/public/images/image-macaron-thumbnail.jpg',
          mobile: 'https://orderfoodonline.deno.dev/public/images/image-macaron-mobile.jpg',
          tablet: 'https://orderfoodonline.deno.dev/public/images/image-macaron-tablet.jpg',
          desktop: 'https://orderfoodonline.deno.dev/public/images/image-macaron-desktop.jpg'
        })
      },
      {
        id: 4,
        sku: 'TIRAMISU-001',
        name: 'Classic Tiramisu',
        category: 'Tiramisu',
        price: 5.50,
        status: 'active',
        description: 'Traditional Italian coffee-flavored dessert',
        images: JSON.stringify({
          thumbnail: 'https://orderfoodonline.deno.dev/public/images/image-tiramisu-thumbnail.jpg',
          mobile: 'https://orderfoodonline.deno.dev/public/images/image-tiramisu-mobile.jpg',
          tablet: 'https://orderfoodonline.deno.dev/public/images/image-tiramisu-tablet.jpg',
          desktop: 'https://orderfoodonline.deno.dev/public/images/image-tiramisu-desktop.jpg'
        })
      },
      {
        id: 5,
        sku: 'BAKLAVA-001',
        name: 'Pistachio Baklava',
        category: 'Baklava',
        price: 4.00,
        status: 'active',
        description: 'Sweet pastry made of layers of filo filled with chopped pistachios',
        images: JSON.stringify({
          thumbnail: 'https://orderfoodonline.deno.dev/public/images/image-baklava-thumbnail.jpg',
          mobile: 'https://orderfoodonline.deno.dev/public/images/image-baklava-mobile.jpg',
          tablet: 'https://orderfoodonline.deno.dev/public/images/image-baklava-tablet.jpg',
          desktop: 'https://orderfoodonline.deno.dev/public/images/image-baklava-desktop.jpg'
        })
      },
      {
        id: 6,
        sku: 'PIE-001',
        name: 'Lemon Meringue Pie',
        category: 'Pie',
        price: 5.00,
        status: 'active',
        description: 'Tangy lemon curd topped with fluffy meringue in a pastry crust',
        images: JSON.stringify({
          thumbnail: 'https://orderfoodonline.deno.dev/public/images/image-meringue-thumbnail.jpg',
          mobile: 'https://orderfoodonline.deno.dev/public/images/image-meringue-mobile.jpg',
          tablet: 'https://orderfoodonline.deno.dev/public/images/image-meringue-tablet.jpg',
          desktop: 'https://orderfoodonline.deno.dev/public/images/image-meringue-desktop.jpg'
        })
      },
      {
        id: 7,
        sku: 'CAKE-001',
        name: 'Red Velvet Cake',
        category: 'Cake',
        price: 4.50,
        status: 'active',
        description: 'Moist red velvet cake with cream cheese frosting',
        images: JSON.stringify({
          thumbnail: 'https://orderfoodonline.deno.dev/public/images/image-cake-thumbnail.jpg',
          mobile: 'https://orderfoodonline.deno.dev/public/images/image-cake-mobile.jpg',
          tablet: 'https://orderfoodonline.deno.dev/public/images/image-cake-tablet.jpg',
          desktop: 'https://orderfoodonline.deno.dev/public/images/image-cake-desktop.jpg'
        })
      },
      {
        id: 8,
        sku: 'BROWNIE-001',
        name: 'Salted Caramel Brownie',
        category: 'Brownie',
        price: 4.50,
        status: 'active',
        description: 'Rich chocolate brownie with salted caramel swirl',
        images: JSON.stringify({
          thumbnail: 'https://orderfoodonline.deno.dev/public/images/image-brownie-thumbnail.jpg',
          mobile: 'https://orderfoodonline.deno.dev/public/images/image-brownie-mobile.jpg',
          tablet: 'https://orderfoodonline.deno.dev/public/images/image-brownie-tablet.jpg',
          desktop: 'https://orderfoodonline.deno.dev/public/images/image-brownie-desktop.jpg'
        })
      },
      {
        id: 9,
        sku: 'PANNA-001',
        name: 'Vanilla Panna Cotta',
        category: 'Panna Cotta',
        price: 6.50,
        status: 'active',
        description: 'Silky smooth Italian dessert infused with vanilla',
        images: JSON.stringify({
          thumbnail: 'https://orderfoodonline.deno.dev/public/images/image-panna-cotta-thumbnail.jpg',
          mobile: 'https://orderfoodonline.deno.dev/public/images/image-panna-cotta-mobile.jpg',
          tablet: 'https://orderfoodonline.deno.dev/public/images/image-panna-cotta-tablet.jpg',
          desktop: 'https://orderfoodonline.deno.dev/public/images/image-panna-cotta-desktop.jpg'
        })
      }
    ];

    // Insert products data
    for (const product of products) {
      await queryRunner.query(
        `INSERT INTO cfs_products (
          id, sku, name, category, price, status, description, images, 
          createdAt, updatedAt, createdBy, updatedBy
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1)`,
        [
          product.id,
          product.sku,
          product.name,
          product.category,
          product.price,
          product.status,
          product.description,
          product.images
        ]
      );
    }

    // Create initial inventory records for all products
    console.log('Creating initial inventory records...');
    
    for (const product of products) {
      await queryRunner.query(
        `INSERT INTO cfs_product_inventories (
          product_sku, warehouse_id, quantity_available, quantity_reserved, 
          quantity_sold, reorder_point, version, createdAt, updatedAt, 
          createdBy, updatedBy
        ) VALUES (?, NULL, 50, 0, 0, 10, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1)`,
        [product.sku]
      );
    }

    console.log(`Successfully imported ${products.length} products with initial inventory.`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete inventory records first (due to foreign key constraint)
    await queryRunner.query(`
      DELETE FROM cfs_product_inventories 
      WHERE product_sku IN (
        'WAFFLE-001', 'CREME-001', 'MACARON-001', 'TIRAMISU-001', 'BAKLAVA-001',
        'PIE-001', 'CAKE-001', 'BROWNIE-001', 'PANNA-001'
      )
    `);

    // Delete products
    await queryRunner.query(`
      DELETE FROM cfs_products 
      WHERE sku IN (
        'WAFFLE-001', 'CREME-001', 'MACARON-001', 'TIRAMISU-001', 'BAKLAVA-001',
        'PIE-001', 'CAKE-001', 'BROWNIE-001', 'PANNA-001'
      )
    `);

    console.log('Successfully removed seeded products and inventory data.');
  }
}
