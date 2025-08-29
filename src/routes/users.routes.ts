import { Router } from 'express';
import { UserController } from '../components/users/controller';
import { validationMiddleware, validateParam } from '../middlewares/validation';
import { CreateUserDto, UpdateUserDto, GetListUserDto } from '../components/users/dto';

export class UserRoutes {
  public router: Router;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // GET /users - Get users list with query validation
    this.router.get('/users', validationMiddleware(GetListUserDto, 'query'), this.userController.getList);

    // GET /users/:id - Get user detail with id validation
    this.router.get('/users/:id', validateParam('id', 'number'), this.userController.getDetail);

    // POST /users - Create new user with body validation
    this.router.post('/users', validationMiddleware(CreateUserDto, 'body'), this.userController.create);

    // PUT /users/:id - Update user with id and body validation
    this.router.put('/users/:id', validateParam('id', 'number'), validationMiddleware(UpdateUserDto, 'body'), this.userController.update);

    // DELETE /users/:id - Delete user with id validation
    this.router.delete('/users/:id', validateParam('id', 'number'), this.userController.delete);
  }
}
