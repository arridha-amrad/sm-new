import { Request, Response } from 'express';
import { findAllConversations } from '../../services/ConversationService';
import { findUnreadMessages } from '../../services/MessageService';

export default async (req: Request, res: Response) => {
  const me = req.userId;
  try {
    const conversations = await findAllConversations({ users: me });
    const getData = async () => {
      let result = [];
      for (let i = 0; i < conversations.length; i++) {
        const unreadMessages = await findUnreadMessages(
          conversations[i].id,
          me
        );
        const total = unreadMessages.length;
        result.push({
          ...conversations[i].toObject(),
          totalUnreadMessage: total,
        });
      }
      return result;
    };

    return res.status(200).json({ conversations: await getData() });
  } catch (err: any) {
    console.log(err);
    return res.sendStatus(500);
  }
};
