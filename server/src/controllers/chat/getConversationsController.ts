import { Request, Response } from 'express';
import { findConversations } from '../../services/ConversationServices';
import { findUserById } from '../../services/UserServices';

export default async (req: Request, res: Response) => {
  const userId = req.app.locals.userId;
  try {
    const conversations = await findConversations(userId);
    return res.status(200).json({ conversations });
  } catch (err: any) {
    console.log(err);
    return res.sendStatus(500);
  }
};
