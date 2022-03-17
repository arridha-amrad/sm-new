import { INotificationModel } from '../models/notification/INotificationModel';

export interface ServerToClientEvents {
  greet: (msg: string) => void;
  likePostSC: (data: INotificationModel) => void;
  likeCommentSC: (notification: INotificationModel) => void;
  likeReplySC: (notification: INotificationModel) => void;
  createCommentSC: (notification: INotificationModel) => void;
  createReplySC: (notification: INotificationModel) => void;
}

export interface ClientToServerEvents {
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
