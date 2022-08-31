import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import JwtServices from '../services/JwtServices';
import Routes from './Routes';

class NewAuthRoutes extends Routes {
  router: Router;
  constructor() {
    super();
    this.router = Router();
    this.routes();
  }
  routes() {
    // login
    this.router.post('/login', AuthController.login);
    // google oauth
    this.router.get('/google', AuthController.googleOAuth);
    // logout
    this.router.post(
      '/logout',
      JwtServices.verifyAuthToken,
      AuthController.logout
    );
  }
}

export default new NewAuthRoutes().router;
