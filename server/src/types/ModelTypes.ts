import { Types } from 'mongoose';

export interface IUserModel {
  fullName?: string;
  username: string;
  strategy: 'default' | 'google';
  email: string;
  password?: string;
  requiredAuthAction: 'none' | 'emailVerification' | 'resetPassword';
  refreshTokens: string[];
  avatarURL: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReplyModel {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  body: string;
  comment: Types.ObjectId;
  likes: Types.DocumentArray<IUserModel>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentModel {
  owner: Types.ObjectId;
  post: Types.ObjectId;
  body: string;
  likes: Types.DocumentArray<IUserModel>;
  replies: Types.DocumentArray<IReplyModel>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversation {
  users: Types.DocumentArray<IUserModel>;
  lastMessage: Types.ObjectId;
  groupName: string;
  isGroup: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostModel {
  owner: Types.ObjectId;
  images: Types.Array<string>;
  body: string;
  comments: Types.DocumentArray<ICommentModel>;
  likes: Types.DocumentArray<IUserModel>;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface IMessage {
  text: string;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  conversationId: Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
