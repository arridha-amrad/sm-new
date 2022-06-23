import { Router } from 'express';
import UserController from '../controllers/UserController';
import JwtServices from '../services/JwtServices';
import Routes from './Routes';

class NewUserRoutes extends Routes {
  router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes() {
    // me
    this.router.get('/me', JwtServices.verifyAuthToken, UserController.me);
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
