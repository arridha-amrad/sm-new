import { FC, Fragment } from "react";
import ReplyCard from "./ReplyCard";
import { IComment } from "../features/comment/IComment";
import { ReplyComment } from "../features/replyComment/IReply";

interface Props {
  comment: IComment;
  postIndex: number;
  commentIndex: number;
  replies: ReplyComment[];
}

const Replies: FC<Props> = ({ replies, postIndex, commentIndex, comment }) => {
  return (
    <div className="mt-2 w-100">
      {replies.map((reply, index) => (
        <Fragment key={reply._id}>
          <ReplyCard
            replyIndex={index}
            comment={comment}
            commentIndex={commentIndex}
            postIndex={postIndex}
            reply={reply}
          />
        </Fragment>
      ))}
    </div>
  );
};

export default Replies;
