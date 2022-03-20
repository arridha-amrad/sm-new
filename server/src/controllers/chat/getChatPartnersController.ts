import { Request, Response } from 'express';
import { findChats } from '../../services/ChatService';

export default async (req: Request, res: Response) => {
  const me = req.userId;
  try {
    const partners = await findChats({ users: me });
    return res.status(200).json({ partners });
  } catch (err: any) {
    console.log(err);
    return res.sendStatus(500);
  }
};
