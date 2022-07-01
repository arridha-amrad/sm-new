import { IConversation, IMessage, INotification } from '../types/ModelTypes';

interface ISetTypingCS {
  isTyping: boolean;
  chatId: string;
  toUsername: string;
}
type ISetTypingSC = Omit<ISetTypingCS, 'toUsername'>;

interface ISendMessageCS {
  conversation: IConversation;
  message: IMessage;
  toUsername: string;
}

interface INotifCS {
  notification: INotification;
  toUsername: string;
}

interface ISendMessageSC {
  conversation: IConversation;
  message: IMessage;
}

export interface ServerToClientEvents {
  likePostSC: (notification: INotification) => void;
  likeCommentSC: (notification: INotification) => void;
  likeReplySC: (notification: INotification) => void;
  createCommentSC: (notification: INotification) => void;
  createReplySC: (notification: INotification) => void;
  sendMessageSC: (props: ISendMessageSC) => void;
  setTypingSC: (props: ISetTypingSC) => void;
}

export interface ClientToServerEvents {
  addUserCS: (username: string) => void;
  setTypingCS: (props: ISetTypingCS) => void;
  sendMessageCS: (props: ISendMessageCS) => void;
  likePostCS: (props: INotifCS) => void;
  likeCommentCS: (props: INotifCS) => void;
  likeReplyCS: (props: INotifCS) => void;
  createCommentCS: (props: INotifCS) => void;
  createReplyCS: (props: INotifCS) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
