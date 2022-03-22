import { Types } from 'mongoose';
import { IUserModel } from '../user/IUserModel';

export interface IConversation {
  users: Types.DocumentArray<IUserModel>;
  lastMessage: string;
  groupName: string;
  isGroup: boolean;
  createdAt: Date;
  updatedAt: Date;
}
