import { Router } from 'express';
import PostController from '../controllers/PostController';
import Routes from './Routes';

class PostRoutes extends Routes {
  router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  routes() {
    // get many posts
    this.router.get('/', PostController.getMany);
    // get single post
    this.router.get('/:id', PostController.getOne);
    // create post
    this.router.post('/', PostController.create);
    // like post
    this.router.post('/like/:id', PostController.like);
    // update post
    this.router.put('/:id', PostController.update);
    // delete post
    this.router.delete('/:id', PostController.delete);
  }
}

export default new PostRoutes().router;
