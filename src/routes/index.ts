import { Router, Request, Response } from 'express';
import { Auth } from '../middlewares/auth';
import { ProductRoutes } from './products.routes';
import { CartRoutes } from './cart.routes';

export class Routes {
  public router: Router;
  constructor() {
    this.router = Router();

    this.router.get('/ping', async (req: Request, res: Response) => {
      res.status(200).send({
        message: 'Pong',
      });
    });

    this.router.use(Auth.verifyToken);

    // Product routes
    const productRoutes = new ProductRoutes();
    this.router.use('/v1', productRoutes.router);

    // Cart routes
    const cartRoutes = new CartRoutes();
    this.router.use('/v1', cartRoutes.router);
  }
}
