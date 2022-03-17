import React, { FormEvent, HTMLProps } from "react";
import { useAppDispatch } from "../../app/hooks";
import useForm from "../../utils/useForm";
import { createCommentAction } from "./commentSlice";
import { Post } from "../post/IPost";

type InputProps = HTMLProps<HTMLInputElement>;

interface Props extends InputProps {
  post: Post;
}

const CommentMaker = React.forwardRef<HTMLInputElement, Props>(
  ({ post }, ref) => {
    const dispatch = useAppDispatch();

    const { state, onChange, setState } = useForm({
      body: "",
    });

    const onSubmit = async (e: FormEvent) => {
      e.preventDefault();
      const res = await dispatch(
        createCommentAction({
          data: state.body,
          postId: post._id,
        })
      );
      if (res.meta.requestStatus === "fulfilled") {
        setState({
          ...state,
          body: "",
        });
      }
    };

    return (
      <form onSubmit={onSubmit} className="d-flex w-100 gap-2 mt-2">
        <input
          name="body"
          value={state.body}
          onChange={onChange}
          ref={ref}
          className="form-control w-100"
          placeholder="comment..."
        />
        <button
          disabled={state.body.length === 0}
          type="submit"
          className="btn btn-primary"
        >
          Send
        </button>
      </form>
    );
  }
);

export default CommentMaker;
