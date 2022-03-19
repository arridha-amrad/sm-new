import { Router } from 'express';
import getLoginUserController from '../controllers/user/getLoginUserController';
import searchUsersController from '../controllers/user/searchUsersController';
import { verifyAccessToken } from '../services/JwtServices';

// eslint-disable-next-line new-cap
const router = Router();

router.get('/me', verifyAccessToken, getLoginUserController);
router.get('/', searchUsersController);

export default router;
