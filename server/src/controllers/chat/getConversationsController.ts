import { Request, Response } from 'express';
import { findConversations } from '../../services/ConversationService';

export default async (req: Request, res: Response) => {
  const me = req.userId;
  try {
    const conversations = await findConversations(me);
    return res.status(200).json({ conversations });
  } catch (err: any) {
    console.log(err);
    return res.sendStatus(500);
  }
};
