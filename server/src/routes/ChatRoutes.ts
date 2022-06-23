import { Router } from 'express';
import JwtServices from '../services/JwtServices';
import Routes from './Routes';

class ChatRoutes extends Routes {
  router: Router;
  constructor() {
    super();
    this.router = Router();
    this.routes();
  }
  routes(): void {
    // send message
    this.router.post('/send', JwtServices.verifyAuthToken);
    // get many conversations
    this.router.get('/many', JwtServices.verifyAuthToken);
    // get one conversation
    this.router.get('/one', JwtServices.verifyAuthToken);
    // get messages
    this.router.get('/messages', JwtServices.verifyAuthToken);
  }
}
export default new ChatRoutes().router;
