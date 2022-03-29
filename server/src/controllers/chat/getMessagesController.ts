import { Request, Response } from 'express';
import { IMessage } from '../../models/message/IMessage';
import { findMessages } from '../../services/MessageService';

export default async (req: Request, res: Response) => {
  const { conversationId } = req.query;
  try {
    let messages: IMessage[] = [];
    if (conversationId !== 'undefined') {
      const data = await findMessages({ conversationId });
      data.forEach(async (d) => {
        d.isRead = true;
        await d.save();
      });
      messages = data;
    }
    return res.status(200).json({ messages });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
