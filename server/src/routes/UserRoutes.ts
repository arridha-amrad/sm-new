import { Router } from 'express';
import UserController from '../controllers/UserController';
import IRoutes from './IRoutes';

class NewUserRoutes {
  router: Router;

  constructor() {
    const myRouter = Router();
    this.router = myRouter;
    this.routes();
  }

  routes() {
    // me
    this.router.get('/me', UserController.me);
    // searchUser
    this.router.get('/searchUser', UserController.searchUser);
    // register
    this.router.post('/register', UserController.register);
    // forgot-password
    this.router.post('/forgot-password', UserController.forgotPassword);
    // reset-password
    this.router.post('/reset-password/:token', UserController.resetPassword);
    // refresh-token
    this.router.post('/refresh-token', UserController.refreshToken);
    // email-verification
    this.router.get('/email-verification/:token');
  }
}

export default new NewUserRoutes().router;
