import { Request, Response } from 'express';
import { IMessage } from '../../models/message/IMessage';
import { findConversation } from '../../services/ConversationServices';
import { findMessages } from '../../services/MessageService';

export default async (req: Request, res: Response) => {
  const { receiverId } = req.query;
  const loginUserId = req.app.locals.userId;
  try {
    const conversation = await findConversation({
      $and: [
        {
          users: {
            $elemMatch: { $eq: loginUserId },
          },
        },
        {
          users: {
            $elemMatch: { $eq: receiverId },
          },
        },
      ],
    });
    let messages: IMessage[] = [];
    if (conversation) {
      messages = await findMessages({
        conversationId: conversation?.id,
      });
    }
    return res.status(200).json({ messages });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
