import { IConversation } from '../models/conversation/IConversation';
import { IMessage } from '../models/message/IMessage';
import { INotificationModel } from '../models/notification/INotificationModel';

export interface ServerToClientEvents {
  greet: (msg: string) => void;
  likePostSC: (data: INotificationModel) => void;
  likeCommentSC: (notification: INotificationModel) => void;
  likeReplySC: (notification: INotificationModel) => void;
  createCommentSC: (notification: INotificationModel) => void;
  createReplySC: (notification: INotificationModel) => void;
  sendMessageSC: (conversation: IConversation, message: IMessage) => void;
  setTypingSC: ({ isTyping }: { isTyping: boolean }) => void;
}

export interface ClientToServerEvents {
  setTypingCS: (
    { isTyping }: { isTyping: boolean },
    toUsername: string
  ) => void;
  sendMessageCS: (
    conversation: IConversation,
    message: IMessage,
    toUsername: string
  ) => void;
  addUserCS: (username: string) => void;
  likePostCS: (data: INotificationModel, toUsername: string) => void;
  likeCommentCS: (notification: INotificationModel, toUsername: string) => void;
  likeReplyCS: (notification: INotificationModel, toUsername: string) => void;
  createCommentCS: (
    notification: INotificationModel,
    toUsername: string
  ) => void;
  createReplyCS: (notification: INotificationModel, toUsername: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
