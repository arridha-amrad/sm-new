import { Types } from 'mongoose';
import { IUserModel } from '../user/IUserModel';

export interface IReplyModel {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  body: string;
  comment: Types.ObjectId;
  likes: Types.DocumentArray<IUserModel>;
  createdAt: Date;
  updatedAt: Date;
}
