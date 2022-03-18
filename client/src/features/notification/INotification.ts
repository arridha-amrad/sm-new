import { User } from "../authentication/IAuthentication";
import { IComment } from "../comment/IComment";
import { Post } from "../post/IPost";
import { ReplyComment } from "../replyComment/IReply";

export enum NotificationType {
  LIKE_POST = "likePost",
  LIKE_COMMENT = "likeComment",
  LIKE_REPLY = "likeReply",
  COMMENT_POST = "commentPost",
  REPLY_COMMENT = "replyComment",
  REPLY_REPLY = "replyOfReply",
}

export interface INotification {
  _id: string;
  type: NotificationType;
  post?: Post;
  comment?: IComment;
  reply?: ReplyComment;
  replyTwo?: ReplyComment;
  owner: User;
  sender: User;
  isRead: boolean;
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationState {
  notifications: INotification[];
}
