import { FC, FormEvent, useEffect, useRef } from 'react';
import Spinner from 'react-bootstrap/esm/Spinner';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import useForm from '../../utils/useForm';
import { Post } from './IPost';
import { selectPostState, updatePostAction } from './postSlice';

interface Props {
  hideFormEditPost: () => void;
  post: Post;
}

const UpdatePostForm: FC<Props> = ({ hideFormEditPost, post }) => {
  const { onChange, setState, state } = useForm({
    body: post.body,
  });

  const { isLoading } = useAppSelector(selectPostState);
  const ref = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await dispatch(
      updatePostAction({
        body: state.body,
        postId: post._id,
      })
    );
    if (res.meta.requestStatus === 'fulfilled') {
      setState({
        ...state,
        body: '',
      });
      hideFormEditPost();
    }
  };

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <form className="d-flex flex-column" onSubmit={onSubmit}>
      <textarea
        ref={ref}
        onChange={onChange}
        value={state.body}
        name="body"
        placeholder="post body"
        style={{ resize: 'none' }}
        className="w-100 form-control"
      />
      <div className="d-flex gap-2 justify-content-end mt-1">
        <button onClick={hideFormEditPost} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="visually-hidden">Loading...</span>
            </>
          ) : (
            'Update'
          )}
        </button>
      </div>
    </form>
  );
};

export default UpdatePostForm;
