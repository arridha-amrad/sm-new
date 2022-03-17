import { Router } from 'express';
import getLoginUserController from '../controllers/user/getLoginUserController';
import { verifyAccessToken } from '../services/JwtServices';

// eslint-disable-next-line new-cap
const router = Router();

router.get('/me', verifyAccessToken, getLoginUserController);

export default router;
