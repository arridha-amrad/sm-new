import express from 'express';
import getConversationController from '../controllers/chat/getConversationController';
import getConversationsController from '../controllers/chat/getConversationsController';
import getMessagesController from '../controllers/chat/getMessagesController';
import sendMessageController from '../controllers/chat/sendMessageController';
import { verifyAccessToken } from '../services/JwtServices';

const router = express.Router();

router.post('/send', verifyAccessToken, sendMessageController);
router.get('/conversations', verifyAccessToken, getConversationsController);
router.get('/', verifyAccessToken, getConversationController);
router.get('/messages', verifyAccessToken, getMessagesController);

export default router;
