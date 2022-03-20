import ChatMessageModel from '../models/chatMessages/ChatMessage';
import { AnyKeys } from 'mongoose';
import { IChatMessage } from '../models/chatMessages/IChatMessages';

export const createChatMessage = async (data: AnyKeys<IChatMessage>) => {
  const newMessage = new ChatMessageModel(data);
  const res = await newMessage.save();
  return findMessage(res.id);
};

export const findMessage = async (messageId: string) => {
  return ChatMessageModel.findById(messageId).populate(
    'sender',
    'username avatarURL'
  );
};
