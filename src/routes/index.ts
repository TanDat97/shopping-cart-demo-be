import { Router, Request, Response } from 'express';
import { Auth } from '../middlewares/auth';
import { UserRoutes } from './users.routes';
import { ProductRoutes } from './products.routes';

export class Routes {
  public router: Router;
  constructor() {
    this.router = Router();

    this.router.get('/ping', (req: Request, res: Response) =>
      res.status(200).send({
        message: 'Pong',
      })
    );

    this.router.use(Auth.verifyToken);

    // User routes
    const userRoutes = new UserRoutes();
    this.router.use('/v1', userRoutes.router);

    // Product routes
    const productRoutes = new ProductRoutes();
    this.router.use('/v1', productRoutes.router);
  }
}
