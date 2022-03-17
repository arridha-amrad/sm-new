import { Request, Response } from 'express';

export default async (_: Request, res: Response) => {
  res.clearCookie(process.env.COOKIE_REFRESH_TOKEN);
  return res.send('logout successfully');
};
