import { Router } from 'express';
import ChatController from '../controllers/ChatController';
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
      this.router.post(
         '/send',
         JwtServices.verifyAuthToken,
         ChatController.sendMessage
      );
      // get many conversations
      this.router.get(
         '/many',
         JwtServices.verifyAuthToken,
         ChatController.getManyConversations
      );
      // get one conversation
      this.router.get(
         '/one',
         JwtServices.verifyAuthToken,
         ChatController.getOneConversation
      );
      // get messages
      this.router.get(
         '/messages',
         JwtServices.verifyAuthToken,
         ChatController.getMessages
      );
   }
}
export default new ChatRoutes().router;
