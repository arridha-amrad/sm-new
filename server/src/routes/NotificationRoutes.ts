import { Router } from 'express';
import NotificationController from '../controllers/NotificationController';
import JwtServices from '../services/JwtServices';
import Routes from './Routes';

class NotificationRoutes extends Routes {
  router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get(
      '/',
      JwtServices.verifyAuthToken,
      NotificationController.get
    );
    this.router.put(
      '/mark-read',
      JwtServices.verifyAuthToken,
      NotificationController.read
    );
  }
}

export default new NotificationRoutes().router;
