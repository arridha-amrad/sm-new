import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUserState } from "../authentication/authSlice";
import { likeReplyAction, setLikeReply } from "../post/postSlice";
import { ReplyComment } from "./IReply";

interface Props {
  reply: ReplyComment;
  postIndex: number;
  commentIndex: number;
  replyIndex: number;
}

const LikeReplyFeature: FC<Props> = ({
  reply,
  postIndex,
  commentIndex,
  replyIndex,
}) => {
  const { loginUser } = useAppSelector(selectUserState);
  const isLiked = reply.likes.find((user) => user._id === loginUser?._id);
  const dispatch = useAppDispatch();

  const handleLikeReply = async () => {
    await dispatch(
      likeReplyAction({
        commentIndex,
        isLiked: !!isLiked,
        loginUser: loginUser!,
        postIndex,
        replyId: reply._id,
        replyIndex,
        toUsername: reply.sender.username,
      })
    );
  };

  return (
    <button
      onClick={handleLikeReply}
      className="btn bg-transparent border-0 p-0"
      style={{ cursor: "pointer" }}
    >
      {isLiked ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          fill="#db19d2"
          className="bi bi-heart-fill"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          fill="currentColor"
          className="bi bi-heart"
          viewBox="0 0 16 16"
        >
          <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
        </svg>
      )}
    </button>
  );
};

export default LikeReplyFeature;
