import { Router } from 'express';
import ReplyController from '../controllers/ReplyController';
import JwtServices from '../services/JwtServices';
import Routes from './Routes';

class ReplyRoutes extends Routes {
  router: Router;
  constructor() {
    super();
    this.router = Router();
    this.routes();
  }
  routes(): void {
    this.router.post(
      '/:commentId',
      JwtServices.verifyAuthToken,
      ReplyController.create
    );
    this.router.post(
      '/like/:replyId',
      JwtServices.verifyAuthToken,
      ReplyController.like
    );
    this.router.delete(
      '/:replyId',
      JwtServices.verifyAuthToken,
      ReplyController.delete
    );
  }
}

export default new ReplyRoutes().router;
