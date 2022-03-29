import ChatModel from '../models/conversation/ConversationModel';
import { IConversation } from '../models/conversation/IConversation';
import { AnyKeys, FilterQuery } from 'mongoose';

export const createConversation = async (data: AnyKeys<IConversation>) => {
  const newConversation = new ChatModel(data);
  const conversation = await newConversation.save();
  return findConversationById(conversation.id);
};

export const findConversation = async (filter: FilterQuery<IConversation>) => {
  return ChatModel.findOne(filter).populate('users', 'username avatarURL');
};

export const findConversationById = async (id: string) => {
  return ChatModel.findById(id)
    .populate('users', 'username avatarURL')
    .populate({
      path: 'lastMessage',
      populate: { path: 'sender', select: 'username' },
    });
};

export const findAllConversations = async (
  filter: FilterQuery<IConversation>
) => {
  return ChatModel.find(filter)
    .sort({ createdAt: 'desc' })
    .populate('users', 'username avatarURL')
    .populate({
      path: 'lastMessage',
      populate: { path: 'sender', select: 'username' },
    });
};
