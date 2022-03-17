import React, { FormEvent } from "react";
import { useAppDispatch } from "../../app/hooks";
import useForm from "../../utils/useForm";
import { User } from "../authentication/IAuthentication";
import { IComment } from "../comment/IComment";
import { replyComment, replyCommentResult } from "../post/postSlice";

import { ReplyComment } from "./IReply";

interface Props {
  isNarrow?: boolean;
  tagUser: User;
  stateIndex: number;
  postIndex: number;
  comment: IComment;
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReplyCommentForm = React.forwardRef<HTMLInputElement, Props>(
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

    const { onChange, state, setState } = useForm({
      body: `@${tagUser.username}`,
    });

    const onSubmit = async (e: FormEvent) => {
      e.preventDefault();
      const res = await dispatch(
        replyComment({
          commentId: comment._id,
          body: state.body,
          receiver: tagUser._id,
        })
      );
      if (res.meta.requestStatus === "fulfilled") {
        const newReply = res.payload as ReplyComment;
        dispatch(
          replyCommentResult({
            commentIndex: stateIndex,
            postIndex: postIndex,
            reply: newReply,
          })
        );
        setState({
          body: `@${tagUser}`,
        });
        setIsShow(false);
      }
    };

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
          <input
            ref={ref}
            onChange={onChange}
            name="body"
            value={state.body}
            placeholder="reply..."
            className="form-control form-control-sm w-100"
          />
          <button type="submit" className="btn btn-primary btn-sm">
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

export default ReplyCommentForm;
