import { Types } from 'mongoose';

export interface IMessage {
  text: string;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  conversationId: Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
