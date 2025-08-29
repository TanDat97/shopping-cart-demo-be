import { Router } from 'express';
import { ProductController } from '../components/products/controller';
import { validationMiddleware, validateParam } from '../middlewares/validation';
import { CreateProductDto, UpdateProductDto, GetListProductDto } from '../components/products/dto';

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

    // POST /products - Create new product with body validation
    this.router.post('/products', validationMiddleware(CreateProductDto, 'body'), this.productController.create);

    // PUT /products/:id - Update product with id and body validation
    this.router.put('/products/:id', validateParam('id', 'number'), validationMiddleware(UpdateProductDto, 'body'), this.productController.update);

    // DELETE /products/:id - Delete product with id validation
    this.router.delete('/products/:id', validateParam('id', 'number'), this.productController.delete);
  }
}
