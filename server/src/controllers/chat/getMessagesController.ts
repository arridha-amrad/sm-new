import { Request, Response } from 'express';
import { IMessage } from '../../models/message/IMessage';
import { findMessages } from '../../services/MessageService';

export default async (req: Request, res: Response) => {
  const { conversationId } = req.query;
  try {
    let messages: IMessage[] = [];
    if (conversationId !== 'undefined') {
      messages = await findMessages({ conversationId });
    }
    return res.status(200).json({ messages });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
