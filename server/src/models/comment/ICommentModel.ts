import { Types } from 'mongoose';
import { IReplyModel } from '../reply/IReplyModel';
import { IUserModel } from '../user/IUserModel';

export interface ICommentModel {
  owner: Types.ObjectId;
  post: Types.ObjectId;
  body: string;
  likes: Types.DocumentArray<IUserModel>;
  replies: Types.DocumentArray<IReplyModel>;
  createdAt: Date;
  updatedAt: Date;
}
