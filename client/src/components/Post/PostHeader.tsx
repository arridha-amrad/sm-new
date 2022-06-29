import { FC } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useAppSelector } from '../../app/hooks';
import { selectAuthState } from '../../features/authentication/authSlice';
import DeletePostButton from '../../features/post/DeletePostFeature';
import { Post } from '../../features/post/IPost';
import timeSetter from '../../utils/timeSetter';

interface IProps {
  post: Post;
  setEdit(): void;
}

const PostHeader: FC<IProps> = ({ post, setEdit }) => {
  const { loginUser } = useAppSelector(selectAuthState);
  return (
    <div className="d-flex gap-4 align-items-center mb-2">
      <img
        style={{ width: '50px', height: '50px' }}
        className="img-thumbnail rounded-circle"
        src={post.owner.avatarURL}
        alt="avatar"
      />
      <div className="d-flex flex-column flex-grow-1">
        <div>{post.owner.username}</div>
        <small className=" text-black-50">
          {timeSetter(new Date(post.createdAt))}
        </small>
      </div>

      <div>
        {post.owner._id === loginUser?._id && (
          <Dropdown className="d-inline mx-2" autoClose="inside">
            <Dropdown.Toggle
              className="bg-secondary rounded-circle"
              id="dropdown-autoclose-outside"
            />

            <Dropdown.Menu>
              <Dropdown.Item onClick={setEdit}>Update Post</Dropdown.Item>
              <DeletePostButton post={post} />
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default PostHeader;
