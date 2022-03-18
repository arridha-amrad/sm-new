import { Types } from 'mongoose';

export enum NotificationType {
  LIKE_POST = 'likePost',
  LIKE_COMMENT = 'likeComment',
  LIKE_REPLY = 'likeReply',
  COMMENT_POST = 'commentPost',
  REPLY_COMMENT = 'replyComment',
  REPLY_REPLY = 'replyOfReply',
}

export interface INotificationModel {
  type: NotificationType;
  post: Types.ObjectId;
  comment: Types.ObjectId;
  reply: Types.ObjectId;
  replyTwo: Types.ObjectId;
  owner: Types.ObjectId;
  sender: Types.ObjectId;
  isRead: boolean;
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}
