import { User } from '../authentication/IAuthentication';

export interface SendChatDTO {
  message: string;
  receiverId: string;
  conversationId?: string;
  isGroup: boolean;
  toUsername: string;
}

export interface IConversation {
  _id?: string;
  users: User[];
  lastMessage?: IMessage;
  groupName?: string;
  totalUnreadMessage: number;
  isGroup: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMessage {
  _id: string;
  text: string;
  conversationId: string;
  sender: User;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SelectedConversation = IConversation & {
  receiverId: string;
  receiverUsername: string;
  conversationIndex: number;
};
