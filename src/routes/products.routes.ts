import { Router } from 'express';
import { ProductController } from '../components/products/controller';
import { validationMiddleware, validateParam } from '../middlewares/validation';
import { GetListProductDto } from '../components/products/dto';

export class ProductRoutes {
  public router: Router;
  private productController: ProductController;

  constructor() {
    this.router = Router();
    this.productController = new ProductController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // GET /products - Get products list with query validation
    this.router.get('/products', validationMiddleware(GetListProductDto, 'query'), this.productController.getList);

    // GET /products/:id - Get product detail with id validation
    this.router.get('/products/:id', validateParam('id', 'number'), this.productController.getDetail);

    // DELETE /products/:id - Delete product with id validation
    this.router.delete('/products/:id', validateParam('id', 'number'), this.productController.delete);
  }
}
