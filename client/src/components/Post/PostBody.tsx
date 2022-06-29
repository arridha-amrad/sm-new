import { FC } from 'react';
import { Post } from '../../features/post/IPost';
import UpdatePostForm from '../../features/post/UpdatePostFeature';

interface IProps {
  post: Post;
  hideFormEditPost(): void;
  isEdit: boolean;
}

const PostBody: FC<IProps> = ({ post, hideFormEditPost, isEdit }) => {
  return (
    <div className="my-3 d-flex align-items-start">
      <div className="flex-grow-1" style={{ whiteSpace: 'pre' }}>
        {isEdit ? (
          <UpdatePostForm post={post} hideFormEditPost={hideFormEditPost} />
        ) : (
          post.body
        )}
      </div>
    </div>
  );
};

export default PostBody;
