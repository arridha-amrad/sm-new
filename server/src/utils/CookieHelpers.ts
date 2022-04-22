import { CookieOptions, Request } from 'express';

export const setCookieOptions: CookieOptions = {
  maxAge: 1000 * 60 * 60 * 24 * 365,
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

export const getRefreshTokenFromCookie = (req: Request) => {
  const bearerToken = req.cookies.refreshToken as string | undefined;
  if (bearerToken) {
    return bearerToken.split(' ')[1];
  }
};
