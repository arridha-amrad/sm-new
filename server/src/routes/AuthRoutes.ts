import Express from 'express';
import emailVerification from '../controllers/authentication/emailVerificationController';
import forgotPassword from '../controllers/authentication/forgotPasswordController';
import login from '../controllers/authentication/loginController';
import logout from '../controllers/authentication/logoutController';
import refreshToken from '../controllers/authentication/refreshTokenController';
import register from '../controllers/authentication/registerController';
import resetPassword from '../controllers/authentication/resetPasswordController';

import googleOauth from '../controllers/authentication/googleAuthController';
import { verifyAccessToken } from '../services/JwtServices';

// eslint-disable-next-line new-cap
const router = Express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/email-verification/:token', emailVerification);
router.get('/refresh-token', refreshToken);
router.post('/logout', verifyAccessToken, logout);
router.get('/google', googleOauth);

export default router;
