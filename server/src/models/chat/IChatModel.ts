import { Types } from 'mongoose';
import { IChatMessage } from '../chatMessages/IChatMessages';
import { IUserModel } from '../user/IUserModel';

export interface IChatModel {
  users: Types.DocumentArray<IUserModel>;
  chatMessages: Types.DocumentArray<IChatMessage>;
  lastMessage: string;
  isGroup: boolean;
  createdAt: Date;
  updatedAt: Date;
}
