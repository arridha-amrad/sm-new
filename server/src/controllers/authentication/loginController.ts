import { Request, Response } from 'express';
import {
  findUserByUsernameOrEmail,
  removeRefreshToken,
} from '../../services/UserServices';
import { emailNotVerified } from '../../templates/Messages';
import argon2 from 'argon2';
import {
  getRefreshTokenFromCookie,
  setCookieOptions,
} from '../../utils/CookieHelpers';
import { loginValidator } from './authFieldValidator';
import { findNotificationsOfOneUser } from '../../services/NotificationService';
import { findConversations } from '../../services/ConversationService';
import { createToken } from '../../services/JwtServices';

export default async (req: Request, res: Response) => {
  const currentRefToken = getRefreshTokenFromCookie(req);
  if (currentRefToken) {
    await removeRefreshToken(currentRefToken);
  }
  const { identity, password } = req.body;
  const { valid, errors } = loginValidator({
    identity,
    password,
  });
  if (!valid) {
    return res.status(400).json(errors);
  }
  try {
    const user = await findUserByUsernameOrEmail(identity);
    if (!user) {
      return res.status(404).send('User not found');
    }
    if (!user.isVerified) {
      return res.status(400).send(emailNotVerified);
    }
    if(user && user.strategy !== "default") {
      return res.status(400).send("This account is registered with different strategy")
    }
    const isMatch = await argon2.verify(user.password!, password!);
    if (!isMatch) {
      return res.status(400).send('Password not match');
    }
    const authToken = await createToken(user.id, 'auth');
    const refreshToken = await createToken(user.id, 'refresh');
    if (authToken && refreshToken) {
      // ref token without bearer keyword
      user.refreshTokens.push(refreshToken);
      await user.save();
      const bearerAuthToken = `Bearer ${authToken}`;
      const bearerRefToken = `Bearer ${refreshToken}`;
      const loginUser = {
        _id: user.id,
        username: user.username,
        email: user.email,
        avatarURL: user.avatarURL,
        fullName: user.fullName,
      };
      const notifications = await findNotificationsOfOneUser(user.id);
      const conversations = await findConversations(user.id);
      return res
        .status(200)
        .cookie(
          process.env.COOKIE_REFRESH_TOKEN,
          bearerRefToken,
          setCookieOptions
        )
        .json({
          user: loginUser,
          token: bearerAuthToken,
          notifications,
          conversations,
        });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
};
