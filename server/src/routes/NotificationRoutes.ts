import express from 'express';
import setReadNotificationController from '../controllers/notification/setReadNotificationController';
import { verifyAccessToken } from '../services/JwtServices';

const router = express.Router();

router.put('/mark-read', verifyAccessToken, setReadNotificationController);

export default router;
