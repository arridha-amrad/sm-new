import Conversation from '../models/ConversationModel';
import { IConversation, IMessage } from '../types/ModelTypes';
import { AnyKeys, FilterQuery } from 'mongoose';
import mongoose from 'mongoose';
import Message from '../models/MessageModel';

class ChatServices {
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
      const unreadMessages = await this.findUnreadMessages(
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

  async findConversation(filter: FilterQuery<IConversation>) {
    try {
      return Conversation.findOne(filter).populate(
        'users',
        'username avatarURL'
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  async createConversation(data: AnyKeys<IConversation>) {
    try {
      const newConversation = new Conversation(data);
      const conversation = await newConversation.save();
      return this.findConversationById(conversation.id);
    } catch (err) {
      throw new Error(err);
    }
  }

  async findConversationById(id: string) {
    try {
      return Conversation.findById(id)
        .populate('users', 'username avatarURL')
        .populate({
          path: 'lastMessage',
          populate: { path: 'sender', select: 'username' },
        });
    } catch (err) {
      throw new Error(err);
    }
  }

  async createMessage(data: AnyKeys<IMessage>) {
    try {
      const newMessage = new Message(data);
      const res = await newMessage.save();
      return this.findMessage(res.id);
    } catch (err) {
      throw new Error(err);
    }
  }

  async findMessage(messageId: string) {
    try {
      return Message.findById(messageId).populate(
        'sender',
        'username avatarURL'
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  async findMessages(filter: FilterQuery<IMessage>) {
    try {
      return Message.find(filter).populate('sender', 'username avatarURL');
    } catch (err) {
      throw new Error(err);
    }
  }

  async findUnreadMessages(conversationId: string, receiverId: string) {
    try {
      return Message.find({
        conversationId,
        isRead: false,
        receiver: receiverId,
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default new ChatServices();
