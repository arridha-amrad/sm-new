import { Request, Response } from 'express';
import { createMessage } from '../../services/MessageService';
import {
  createConversation,
  findConversation,
} from '../../services/ConversationService';

export default async (req: Request, res: Response) => {
  const { conversationId, isGroup } = req.query;
  const chatSender = req.userId;
  const { message, receiverId } = req.body;

  console.log('conversationId : ', conversationId);
  console.log('isGroup : ', isGroup);

  try {
    let conversation;
    const c = await findConversation({
      $and: [{ users: chatSender }, { users: receiverId }],
    });

    if (!c) {
      conversation = await createConversation({
        users: [chatSender, receiverId],
      });
    } else {
      conversation = c;
    }

    const newMessage = await createMessage({
      conversationId: conversation?.id,
      sender: chatSender,
      text: message,
    });

    return res.status(200).json({ conversation, message: newMessage });
  } catch (err: any) {
    console.log(err);
    return res.sendStatus(500);
  }
};
