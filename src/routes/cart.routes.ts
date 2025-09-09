import { Router } from 'express';
import { ShoppingCartController } from '../components/shopping-carts/controller';
import { validationMiddleware } from '../middlewares/validation';
import { CheckoutCartDto, GetCartDto, PreviewCartDto } from '../components/shopping-carts/dto';

export class CartRoutes {
  public router: Router;
  private cartController: ShoppingCartController;

  constructor() {
    this.router = Router();
    this.cartController = new ShoppingCartController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // GET /carts - Get carts list with query validation
    this.router.get('/carts/user', validationMiddleware(GetCartDto, 'query'), this.cartController.getDetailByUser);

    // POST /carts/preview - Preview cart calculation without saving
    this.router.post('/carts/preview', validationMiddleware(PreviewCartDto, 'body'), this.cartController.previewCart);

    // POST /carts/checkout
    this.router.post('/carts/checkout', validationMiddleware(CheckoutCartDto, 'body'), this.cartController.checkoutCart);
  }
}
