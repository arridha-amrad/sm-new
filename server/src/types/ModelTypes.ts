import { Types } from 'mongoose';

export interface IUser {
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

export interface IReply {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  body: string;
  comment: Types.ObjectId;
  likes: Types.DocumentArray<IUser>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  owner: Types.ObjectId;
  post: Types.ObjectId;
  body: string;
  likes: Types.DocumentArray<IUser>;
  replies: Types.DocumentArray<IReply>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversation {
  users: Types.DocumentArray<IUser>;
  lastMessage: Types.ObjectId;
  groupName: string;
  isGroup: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost {
  owner: Types.ObjectId;
  images: Types.Array<string>;
  body: string;
  comments: Types.DocumentArray<IComment>;
  likes: Types.DocumentArray<IUser>;
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

export interface INotification {
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
