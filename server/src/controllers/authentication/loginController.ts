import { Request, Response } from 'express';
import { findUserByUsernameOrEmail } from '../../services/UserServices';
import { emailNotVerified } from '../../templates/Message';
import argon2 from 'argon2';
import { signAccessToken, signRefreshToken } from '../../services/JwtServices';
import { setCookieOptions } from '../../utils/CookieHelpers';
import { loginValidator } from './authFieldValidator';
import { findNotificationsOfOneUser } from '../../services/NotificationService';

export default async (req: Request, res: Response) => {
  const { identity, password } = req.body;
  const { valid, errors } = loginValidator({
    identity,
    password,
  });
  if (!valid) {
    return res.status(400).json(errors);
  }
  try {
    // get user from DB
    const user = await findUserByUsernameOrEmail(identity);
    if (!user) {
      return res.status(404).send('User not found');
    }
    if (!user.isVerified) {
      return res.status(400).send(emailNotVerified);
    }

    // compare the password
    const isMatch = await argon2.verify(user.password!, password!);
    if (!isMatch) {
      return res.status(400).send('Password not match');
    }

    // create accessToken and refreshToken
    const accessToken = await signAccessToken(user.id!);
    const refreshToken = await signRefreshToken(user);

    const loginUser = {
      _id: user.id,
      username: user.username,
      email: user.email,
      avatarURL: user.avatarURL,
      fullName: user.fullName,
    };

    const notifications = await findNotificationsOfOneUser(user.id);

    return res
      .status(200)
      .cookie(process.env.COOKIE_REFRESH_TOKEN, refreshToken, setCookieOptions)
      .json({ user: loginUser, token: accessToken, notifications });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server Error');
  }
};
