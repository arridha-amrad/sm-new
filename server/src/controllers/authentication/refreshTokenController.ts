import { Request, Response } from 'express';
import { createToken, verifyToken } from '../../services/JwtServices';
import { findUser, findUserById } from '../../services/UserServices';
import {
  getRefreshTokenFromCookie,
  setCookieOptions,
} from '../../utils/CookieHelpers';

export default async (req: Request, res: Response) => {
  const refreshToken = getRefreshTokenFromCookie(req);

  try {
    if (refreshToken) {
      const userId = await verifyToken(refreshToken, 'refresh');
      const user = await findUser({ refreshTokens: refreshToken });
      // Refresh Token reuse detected
      if (!user) {
        const hackedUser = await findUserById(userId!);
        if (hackedUser) {
          hackedUser.refreshTokens = [];
          await hackedUser.save();
        }
        return res.sendStatus(403);
      }
      const newRefreshTokens = user.refreshTokens.filter(
        (rt) => rt !== refreshToken
      );
      const newRefreshToken = await createToken(user.id, 'refresh');
      const newAuthToken = await createToken(user.id, 'auth');

      if (newRefreshToken && newAuthToken) {
        user.refreshTokens = [...newRefreshTokens, newRefreshToken];
        await user.save();

        return res
          .status(200)
          .cookie(
            process.env.COOKIE_REFRESH_TOKEN,
            `Bearer ${newRefreshToken}`,
            setCookieOptions
          )
          .json({ token: `Bearer ${newAuthToken}` });
      }
    }
    return res.sendStatus(401);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
