import Message from '../models/message/MessageModel';
import { AnyKeys, FilterQuery } from 'mongoose';
import { IMessage } from '../models/message/IMessage';

export const createMessage = async (data: AnyKeys<IMessage>) => {
  const newMessage = new Message(data);
  const res = await newMessage.save();
  return findMessage(res.id);
};

export const findMessage = async (messageId: string) => {
  return Message.findById(messageId).populate('sender', 'username avatarURL');
};

export const findMessages = async (filter: FilterQuery<IMessage>) => {
  return Message.find(filter).populate('sender', 'username avatarURL');
};

export const findUnreadMessages = async (
  conversationId: string,
  receiverId: string
) => {
  return Message.find({ conversationId, isRead: false, receiver: receiverId });
};
