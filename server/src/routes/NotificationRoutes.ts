import express from 'express';
import setReadNotificationController from '../controllers/notification/setReadNotificationController';
import { verifyAuthToken } from '../services/JwtServices';

const router = express.Router();

router.put('/mark-read', verifyAuthToken, setReadNotificationController);

export default router;
