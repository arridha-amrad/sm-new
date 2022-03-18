import React from "react";
import { useAppDispatch } from "../../app/hooks";
import useFormHooks from "../../utils/useFormHooks";
import { User } from "../authentication/IAuthentication";
import { IComment } from "../comment/IComment";
import { replyCommentAction } from "../post/postSlice";

interface Props {
  isNarrow?: boolean;
  tagUser: User;
  stateIndex: number;
  postIndex: number;
  comment: IComment;
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateReplyFeature = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      comment,
      stateIndex,
      postIndex,
      isShow,
      setIsShow,
      tagUser,
      isNarrow = false,
    },
    ref
  ) => {
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

    const createReply = async () => {
      const res = await dispatch(
        replyCommentAction({
          commentId: comment._id,
          body: state.body,
          receiverId: tagUser._id,
          toUsername: tagUser.username,
          commentIndex: stateIndex,
          postIndex,
        })
      );
      if (res.meta.requestStatus === "fulfilled") {
        setState({
          body: `@${tagUser.username}`,
        });
        setIsShow(false);
      }
    };

    const { fieldErrors, isLoading, onChange, onSubmit, setState, state } =
      useFormHooks(
        {
          body: `@${tagUser.username}`,
        },
        createReply,
        checkField
      );

    return (
      <div
        style={
          isShow
            ? { position: "absolute", top: isNarrow ? "38px" : "65px" }
            : { position: "absolute", left: "-9999px" }
        }
        className="mt-2 w-100"
      >
        <form className="d-flex gap-2 flex-grow-1" onSubmit={onSubmit}>
          <div className="flex-grow-1">
            <input
              ref={ref}
              onChange={onChange}
              name="body"
              value={state.body}
              placeholder="reply..."
              className="form-control form-control-sm w-100"
            />
            <small className="text-danger">{fieldErrors?.body}</small>
          </div>
          <button
            disabled={isLoading || !state.body}
            type="submit"
            className="btn btn-primary btn-sm"
          >
            reply
          </button>
          <button
            type="button"
            onClick={() => setIsShow(false)}
            className="btn btn-secondary btn-sm"
          >
            cancel
          </button>
        </form>
      </div>
    );
  }
);

export default CreateReplyFeature;
