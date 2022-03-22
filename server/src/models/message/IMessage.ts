import { Types } from 'mongoose';

export interface IMessage {
  text: string;
  sender: Types.ObjectId;
  conversationId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
