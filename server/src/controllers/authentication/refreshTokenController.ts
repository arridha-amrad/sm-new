import { Request, Response } from 'express';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../services/JwtServices';
import { findUserById } from '../../services/UserServices';
import {
  getRefreshTokenFromCookie,
  setCookieOptions,
} from '../../utils/CookieHelpers';

export default async (req: Request, res: Response) => {
  const refreshToken = getRefreshTokenFromCookie(req);
  try {
    if (refreshToken) {
      const refreshTokenPayload = await verifyRefreshToken(refreshToken);
      if (refreshTokenPayload) {
        const { jwtVersion, userId } = refreshTokenPayload;
        const user = await findUserById(userId, 'jwtVersion');
        if (jwtVersion === user?.jwtVersion) {
          const newAccessToken = await signAccessToken(userId);
          const newRefreshToken = await signRefreshToken(user);
          return res
            .cookie(
              process.env.COOKIE_REFRESH_TOKEN,
              newRefreshToken,
              setCookieOptions
            )
            .json({ token: newAccessToken });
        }
      }
    }
    return res.sendStatus(401);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
