import Conversation from '../models/conversation/ConversationModel';
import { IConversation } from '../models/conversation/IConversation';
import { AnyKeys, FilterQuery } from 'mongoose';
import { findUnreadMessages } from './MessageService';
import mongoose from 'mongoose';

class ConversationServices {
  async findConversations(userId: string) {
    const objectId = new mongoose.Types.ObjectId(userId);
    const conversations = await Conversation.find({
      users: {
        $elemMatch: {
          $eq: objectId,
        },
      },
    })
      .sort({ createdAt: 'desc' })
      .populate('users', 'username avatarURL')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'username' },
      });
    let myConversations = [];
    for (let i = 0; i < conversations.length; i++) {
      const unreadMessages = await findUnreadMessages(
        conversations[i].id,
        userId
      );
      myConversations.push({
        ...conversations[i].toObject(),
        totalUnreadMessage: unreadMessages.length,
      });
    }
    return myConversations;
  }
}

export default new ConversationServices();

export const createConversation = async (data: AnyKeys<IConversation>) => {
  const newConversation = new Conversation(data);
  const conversation = await newConversation.save();
  return findConversationById(conversation.id);
};

export const findConversation = async (filter: FilterQuery<IConversation>) => {
  return Conversation.findOne(filter).populate('users', 'username avatarURL');
};

export const findConversationById = async (id: string) => {
  return Conversation.findById(id)
    .populate('users', 'username avatarURL')
    .populate({
      path: 'lastMessage',
      populate: { path: 'sender', select: 'username' },
    });
};
