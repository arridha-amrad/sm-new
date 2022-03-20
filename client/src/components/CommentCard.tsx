import { FC, useRef, useState } from "react";
import { useAppSelector } from "../app/hooks";
import { selectAuthState } from "../features/authentication/authSlice";
import DeleteCommentButton from "../features/comment/DeleteCommentFeature";
import { IComment } from "../features/comment/IComment";
import LikeCommentButton from "../features/comment/LikeCommentFeature";
import ReplyCommentForm from "../features/replyComment/CreateReplyFeature";
import CommentReplies from "./Replies";
import timeSetter from "../utils/timeSetter";

interface Props {
  comment: IComment;
  postIndex: number;
  commentIndex: number;
}

const CommentCard: FC<Props> = ({ comment, postIndex, commentIndex }) => {
  const { loginUser } = useAppSelector(selectAuthState);
  const [isShowReplyForm, setIsShowReplyForm] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="d-flex gap-3 border rounded-3 p-2 mb-2" key={comment._id}>
      <img
        src={comment.owner.avatarURL}
        className="rounded-circle"
        style={{ width: "40px", height: "40px" }}
        alt="avatar"
      />

      <div
        style={{ position: "relative" }}
        className="d-flex flex-column flex-grow-1"
      >
        <div>{comment.owner.username}</div>
        <small className="text-black-50">
          {timeSetter(new Date(comment.createdAt))}
        </small>
        <div>{comment.body}</div>
        <div className="d-flex gap-2 align-items-center">
          {comment.likes.length > 0 && (
            <span className=" text-black-50">{comment.likes.length}</span>
          )}
          <LikeCommentButton comment={comment} />

          {comment.owner._id !== loginUser?._id && (
            <div
              onClick={() => {
                setIsShowReplyForm(true);
                ref.current?.focus();
              }}
              className="btn btn-sm"
            >
              reply
            </div>
          )}
        </div>

        <ReplyCommentForm
          isReplyToReply={false}
          tagUser={comment.owner}
          ref={ref}
          isShow={isShowReplyForm}
          setIsShow={setIsShowReplyForm}
          postIndex={postIndex}
          stateIndex={commentIndex}
          comment={comment}
        />

        {comment.replies && (
          <CommentReplies
            comment={comment}
            commentIndex={commentIndex}
            postIndex={postIndex}
            replies={comment.replies}
          />
        )}
      </div>

      {comment.owner.username === loginUser?.username && (
        <div>
          <DeleteCommentButton comment={comment} />
        </div>
      )}
    </div>
  );
};

export default CommentCard;
