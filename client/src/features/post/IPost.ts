import { IComment } from "../comment/IComment";
import { User } from "../authentication/IAuthentication";
import { INotification } from "../notification/INotification";

export interface Post {
  _id: string;
  body: string;
  owner: User;
  images: string[];
  comments: IComment[];
  likes: User[];
  createdAt: Date;
  updatedAt: Date;
  isEdit: boolean;
}

export interface PostState {
  isLoading: boolean;
  isFetchingPosts: boolean;
  posts: Post[];
  post: Post | null;
}

export interface UpdatePostDTO {
  body: string;
  postId: string;
}

export interface LikePostResponse {
  post: Post;
  notification: INotification;
}
