import { Router } from 'express';
import NotificationController from '../controllers/NotificationController';
import JwtServices from '../services/JwtServices';
import IRoutes from './IRoutes';

class NotificationRoutes extends IRoutes {
  router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.put(
      '/mark-read',
      JwtServices.verifyAuthToken,
      NotificationController.read
    );

    this.router.get('/', (req, res) => res.send('Notif routes'));
  }
}

export default new NotificationRoutes().router;
