import { Request, Response } from 'express';
import { findUser } from '../../services/UserServices';
import { getRefreshTokenFromCookie } from '../../utils/CookieHelpers';

export default async (req: Request, res: Response) => {
  const refreshToken = getRefreshTokenFromCookie(req);
  const user = await findUser({ refreshTokens: refreshToken });
  if (user) {
    const refreshTokens = user.refreshTokens.filter(
      (rt) => rt !== refreshToken
    );
    user.refreshTokens = refreshTokens;
    await user.save();
  }
  res.clearCookie(process.env.COOKIE_REFRESH_TOKEN);
  return res.send('logout successfully');
};
