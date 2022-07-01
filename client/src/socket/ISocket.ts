import {
  IConversation,
  IMessage,
  INotificationModel,
} from "../types/ModelTypes";

interface ISetTyping {
  isTyping: boolean;
  chatId: string;
  toUsername: string;
}

type ISetTypingSC = Omit<ISetTyping, "toUsername">;

export interface ServerToClientEvents {
  greet: (msg: string) => void;
  likePostSC: (data: INotificationModel) => void;
  likeCommentSC: (notification: INotificationModel) => void;
  likeReplySC: (notification: INotificationModel) => void;
  createCommentSC: (notification: INotificationModel) => void;
  createReplySC: (notification: INotificationModel) => void;
  sendMessageSC: (conversation: IConversation, message: IMessage) => void;
  setTypingSC: (props: ISetTypingSC) => void;
}

export interface ClientToServerEvents {
  setTypingCS: (props: ISetTyping) => void;
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
