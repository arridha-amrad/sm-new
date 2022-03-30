import { Request, Response } from 'express';
import {
  createMessage,
  findMessages,
  findUnreadMessages,
} from '../../services/MessageService';
import {
  createConversation,
  findConversation,
  findConversationById,
} from '../../services/ConversationService';

export default async (req: Request, res: Response) => {
  const { conversationId, isGroup } = req.query;
  const chatSender = req.userId;
  const { message, receiverId } = req.body;

  console.log('conversationId : ', conversationId);
  console.log('isGroup : ', isGroup);

  try {
    let conversation = await findConversation({
      $and: [{ users: chatSender }, { users: receiverId }],
    });

    if (!conversation) {
      conversation = await createConversation({
        users: [chatSender, receiverId],
      });
    }

    const newMessage = await createMessage({
      conversationId: conversation?.id,
      sender: chatSender,
      receiver: receiverId,
      text: message,
    });

    conversation!.lastMessage = newMessage?.id!;
    const upcon = await conversation?.save();

    const populatedConversation = await findConversationById(upcon?.id);

    const unreadMessages = await findUnreadMessages(upcon?.id, receiverId);

    const data = {
      ...populatedConversation?.toObject(),
      totalUnreadMessage: unreadMessages.length,
    };

    if (conversationId !== 'undefined') {
      const data = await findMessages({ conversationId });
      data.forEach(async (d) => {
        if (d.receiver.toString() === chatSender) {
          d.isRead = true;
          await d.save();
        }
      });
    }

    return res.status(200).json({ conversation: data, message: newMessage });
  } catch (err: any) {
    console.log(err);
    return res.sendStatus(500);
  }
};
