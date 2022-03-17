import { ReplyComment } from "../replyComment/IReply";
import { User } from "../authentication/IAuthentication";

export interface IComment {
  _id: string;
  replies: ReplyComment[];
  owner: User;
  post: string;
  body: string;
  likes: User[];
  createdAt: Date;
  updatedAt: Date;
  isShowInput: boolean;
}

export interface CreateCommentDTO {
  data: string;
  postId: string;
}

export interface DeleteCommentDTO {
  postId: string;
  commentId: string;
}

export interface LikeComment {
  comment: IComment;
  isLiked: boolean;
  user: User;
}

export interface UnsetReplyCommentForm {
  commentIndex: number;
  comment: IComment;
}
