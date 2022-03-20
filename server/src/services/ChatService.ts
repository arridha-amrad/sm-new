import ChatModel from '../models/chat/ChatModel';
import { IChatModel } from '../models/chat/IChatModel';
import { AnyKeys, FilterQuery } from 'mongoose';

export const initChat = async (data: AnyKeys<IChatModel>) => {
  const newChat = new ChatModel(data);
  const chat = await newChat.save();
  return findChat(chat.id);
};

export const findChat = async (chatId: string) => {
  return ChatModel.findById(chatId)
    .populate('users', 'username avatarURL')
    .populate({
      path: 'chatMessages',
      populate: {
        path: 'sender',
        select: 'username avatarURL',
      },
    });
};

export const findChats = async (filter: FilterQuery<IChatModel>) => {
  return ChatModel.find(filter);
};
