import { Request, Response } from 'express';
import { createChatMessage } from '../../services/ChatMessageService';
import { findChat, initChat } from '../../services/ChatService';

export default async (req: Request, res: Response) => {
  const { chatId, isGroup } = req.query;
  const chatSender = req.userId;
  const { message, receiverId } = req.body;
  try {
    let chat;
    const newMessage = await createChatMessage({
      body: message,
      sender: chatSender,
    });
    if (chatId === '') {
      chat = await initChat({
        lastMessage: message,
        isGroup: isGroup === 'true',
        users: [chatSender, receiverId],
      });
    } else {
      chat = await findChat(chatId as string);
    }
    if (chat) {
      chat.chatMessages.push(newMessage!);
      await chat.save();
      return res.status(200).json({ chat });
    }
  } catch (err: any) {
    console.log(err);
    return res.sendStatus(500);
  }
};
