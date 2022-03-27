import { User } from "../authentication/IAuthentication";

export interface SendChatDTO {
  message: string;
  receiverId: string;
  conversationId?: string;
  isGroup: boolean;
  toUsername: string;
}

export interface Conversation {
  _id?: string;
  users: User[];
  lastMessage?: string;
  groupName?: string;
  isGroup: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Message {
  _id: string;
  text: string;
  conversationId: string;
  sender: User;
  createdAt: Date;
  updatedAt: Date;
}

export type SelectedConversation = Conversation & {
  receiverId: string;
  receiverUsername: string;
  conversationIndex: number;
};
