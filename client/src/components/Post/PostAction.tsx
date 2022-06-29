import { FC } from 'react';
import { Post } from '../../features/post/IPost';
import LikePostButton from '../../features/post/LikePostFeature';
import CommentIcon from '../CommentIcon';

interface IProps {
  post: Post;
  postIndexInRedux: number;
  setFocusToCommentForm(): void;
  totalComments: number;
}

const PostAction: FC<IProps> = ({
  post,
  postIndexInRedux,
  setFocusToCommentForm,
  totalComments,
}) => {
  return (
    <div className="d-flex my-2 align-items-center gap-2">
      {post.likes.length > 0 && (
        <span className=" fw-bolder">{post.likes.length}</span>
      )}
      <LikePostButton post={post} stateIndex={postIndexInRedux} />
      <CommentButton
        post={post}
        setFocusToCommentForm={setFocusToCommentForm}
        totalComments={totalComments}
      />
    </div>
  );
};

export const CommentButton: FC<Omit<IProps, 'postIndexInRedux'>> = ({
  setFocusToCommentForm,
  post,
  totalComments,
}) => {
  return (
    <button
      onClick={setFocusToCommentForm}
      className="btn bg-transparent border-0"
    >
      <div className="d-flex align-items-center gap-2">
        {post.comments.length > 0 && (
          <div className=" fw-bolder">{totalComments}</div>
        )}
        <div>
          <CommentIcon />
        </div>
      </div>
    </button>
  );
};

export default PostAction;
