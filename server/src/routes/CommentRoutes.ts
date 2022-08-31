import { Router } from 'express';
import Routes from './Routes';
import JwtServices from '../services/JwtServices';
import CommentController from '../controllers/CommentController';

class CommentRoutes extends Routes {
  router: Router;
  constructor() {
    super();
    this.router = Router();
    this.routes();
  }
  routes(): void {
    // create comment
    this.router.post(
      '/:postId',
      JwtServices.verifyAuthToken,
      CommentController.create
    );
    // like comment
    this.router.post(
      '/like/:commentId',
      JwtServices.verifyAuthToken,
      CommentController.like
    );
    // delete comment
    this.router.delete(
      '/:commentId',
      JwtServices.verifyAuthToken,
      CommentController.delete
    );
    // update comment
    this.router.put(
      '/:commentId',
      JwtServices.verifyAuthToken,
      CommentController.update
    );
  }
}

export default new CommentRoutes().router;
