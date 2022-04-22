import express from 'express';
import getConversationController from '../controllers/chat/getConversationController';
import getConversationsController from '../controllers/chat/getConversationsController';
import getMessagesController from '../controllers/chat/getMessagesController';
import sendMessageController from '../controllers/chat/sendMessageController';
import { verifyAuthToken } from '../services/JwtServices';

const router = express.Router();

router.post('/send', verifyAuthToken, sendMessageController);
router.get('/conversations', verifyAuthToken, getConversationsController);
router.get('/', verifyAuthToken, getConversationController);
router.get('/messages', verifyAuthToken, getMessagesController);

export default router;
