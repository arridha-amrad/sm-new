import { FC, useCallback, useRef, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectAuthState } from '../../features/authentication/authSlice';
import CommentMaker from '../../features/comment/CreateCommentFeature';
import Comments from '../../features/comment/Comments';
import { Post } from '../../features/post/IPost';
import setLikes from '../../utils/likeHelpers';
import PostHeader from './PostHeader';
import PostImages from './PostImages';
import PostBody from './PostBody';
import PostAction from './PostAction';

interface Props {
  post: Post;
  stateIndex: number;
}

const PostCard: FC<Props> = ({ post, stateIndex }) => {
  const [isEdit, setIsEdit] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const { loginUser } = useAppSelector(selectAuthState);

  const sumComments = useCallback(() => {
    let repliesLength = 0;
    const comments = post.comments;
    const commentLength = comments.length;
    comments.forEach((comment) => (repliesLength += comment.replies.length));
    return commentLength + repliesLength;
  }, [post.comments]);

  return (
    <div className="row justify-content-start mb-4 px-2">
      <div className="col-12 rounded border p-3">
        <PostHeader
          post={post}
          setEdit={() => {
            setIsEdit(true);
          }}
        />
        <PostImages post={post} />
        <PostBody
          post={post}
          isEdit={isEdit}
          hideFormEditPost={() => setIsEdit(false)}
        />
        <PostAction
          post={post}
          postIndexInRedux={stateIndex}
          setFocusToCommentForm={() => ref.current?.focus()}
          totalComments={sumComments()}
        />
        {post.likes.length > 0 && (
          <div className="mb-3">
            Liked by {setLikes(post.likes, loginUser!)}
          </div>
        )}
        <Comments comments={post.comments} postIndex={stateIndex} />
        <CommentMaker post={post} ref={ref} />
      </div>
    </div>
  );
};

export default PostCard;
