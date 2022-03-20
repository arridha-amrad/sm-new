import { FC, useRef, useState } from "react";
import { useAppSelector } from "../app/hooks";
import { selectAuthState } from "../features/authentication/authSlice";
import { IComment } from "../features/comment/IComment";
import CreateReplyFeature from "../features/replyComment/CreateReplyFeature";
import DeleteReplyButton from "../features/replyComment/DeleteReplyFeature";
import { ReplyComment } from "../features/replyComment/IReply";
import LikeReplyFeature from "../features/replyComment/LikeReplyFeatures";
import timeSetter from "../utils/timeSetter";

interface Props {
  reply: ReplyComment;
  commentIndex: number;
  postIndex: number;
  comment: IComment;
  replyIndex: number;
}

const ReplyCard: FC<Props> = ({
  reply,
  commentIndex,
  postIndex,
  comment,
  replyIndex,
}) => {
  const { loginUser } = useAppSelector(selectAuthState);
  const [isShow, setIsShow] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="d-flex gap-3 align-items-start border rounded p-2 mb-1">
      <div>
        <img
          src={reply.sender.avatarURL}
          className=" rounded-circle"
          style={{ width: "30px", height: "30px" }}
          alt="avatar"
        />
      </div>
      <div
        className="d-flex flex-column w-100"
        style={{ position: "relative" }}
      >
        <div className="d-flex gap-2 align-items-center">
          <small>{reply.sender.username}</small>
          <small className=" text-muted">
            {timeSetter(new Date(reply.createdAt))}
          </small>

          {reply.sender._id === loginUser?._id && (
            <DeleteReplyButton
              commentIndex={commentIndex}
              postIndex={postIndex}
              reply={reply}
            />
          )}
        </div>
        <small>{reply.body}</small>

        <div className="d-flex gap-2 align-items-center">
          {reply.likes.length > 0 && (
            <span className=" text-muted">{reply.likes.length}</span>
          )}
          <LikeReplyFeature
            replyIndex={replyIndex}
            reply={reply}
            commentIndex={commentIndex}
            postIndex={postIndex}
          />

          {reply.sender._id !== loginUser?._id && (
            <button
              onClick={() => {
                setIsShow(true);
                ref.current?.focus();
              }}
              className="btn btn-sm"
            >
              reply
            </button>
          )}
        </div>

        <CreateReplyFeature
          isReplyToReply={true}
          answeredReplyId={reply._id}
          isNarrow={true}
          ref={ref}
          tagUser={reply.sender}
          comment={comment}
          isShow={isShow}
          postIndex={postIndex}
          setIsShow={setIsShow}
          stateIndex={commentIndex}
        />
      </div>
    </div>
  );
};

export default ReplyCard;
