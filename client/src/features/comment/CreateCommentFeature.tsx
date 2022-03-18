import React, { FormEvent, HTMLProps } from "react";
import { useAppDispatch } from "../../app/hooks";
import useForm from "../../utils/useForm";
import { createCommentAction } from "./commentSlice";
import { Post } from "../post/IPost";
import useFormHooks from "../../utils/useFormHooks";

type InputProps = HTMLProps<HTMLInputElement>;

interface Props extends InputProps {
  post: Post;
}

const CommentMaker = React.forwardRef<HTMLInputElement, Props>(
  ({ post }, ref) => {
    const dispatch = useAppDispatch();

    const checkField = () => {
      let errors: { body?: string } = {};
      if (state.body.trim() === "") {
        errors.body = "Identity field is required";
      }
      return {
        errors,
        isValid: Object.keys(errors).length <= 0,
      };
    };

    const createComment = async () => {
      const res = await dispatch(
        createCommentAction({
          data: state.body,
          postId: post._id,
          toUsername: post.owner.username,
        })
      );
      if (res.meta.requestStatus === "fulfilled") {
        setState({
          ...state,
          body: "",
        });
      }
    };

    const { fieldErrors, isLoading, onChange, onSubmit, setState, state } =
      useFormHooks(
        {
          body: "",
        },
        createComment,
        checkField
      );

    return (
      <form onSubmit={onSubmit} className="d-flex w-100 gap-2 mt-2">
        <div className="flex-grow-1">
          <input
            name="body"
            value={state.body}
            onChange={onChange}
            ref={ref}
            className="form-control w-100"
            placeholder="comment..."
          />
          <small className="text-danger">{fieldErrors?.body}</small>
        </div>
        <button
          disabled={isLoading || state.body.length === 0}
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
