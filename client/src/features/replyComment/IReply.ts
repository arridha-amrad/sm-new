import { User } from "../authentication/IAuthentication";

export interface ReplyComment {
  _id: string;
  body: string;
  likes: User[];
  sender: User;
  receiver: User;
  comment: Comment;
  createdAt: Date;
  updatedAt: Date;
}

export interface LikeReplyDTO {
  postIndex: number;
  commentIndex: number;
  replyIndex: number;
  isLiked: boolean;
  loginUser: User;
  toUsername: string;
  replyId: string;
}

export interface ReplyCommentDTO {
  commentId: string;
  body: string;
  receiverId: string;
  postIndex: number;
  commentIndex: number;
  toUsername: string;
}

export interface ReplyCommentResult {
  postIndex: number;
  commentIndex: number;
  reply: ReplyComment;
}

export interface DeleteReplyDTO {
  replyId: string;
  commentIndex: number;
  postIndex: number;
}
