import { Types } from 'mongoose';

export interface IChatMessage {
  body: string;
  sender: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
