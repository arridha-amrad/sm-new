import { Router } from 'express';
import AuthController from '../controllers/AuthController';

class NewAuthRoutes {
  router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {
    // login
    this.router.post('/login', AuthController.login);
    // google oauth
    this.router.post('/google-oauth', AuthController.googleOAuth);
    // logout
    this.router.post('/logout', AuthController.logout);
  }
}

export default new NewAuthRoutes().router;
