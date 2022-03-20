import express from 'express';
import getChatPartnersController from '../controllers/chat/getChatPartnersController';
import sendChatController from '../controllers/chat/sendChatController';
import { verifyAccessToken } from '../services/JwtServices';

const router = express.Router();

router.post('/send', verifyAccessToken, sendChatController);
router.get('/partners', verifyAccessToken, getChatPartnersController);

export default router;
