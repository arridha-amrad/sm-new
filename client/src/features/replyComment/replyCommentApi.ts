import axiosInstance from "../../utils/axiosInterceptor";

const url = "/api/reply";

export const createReplyAPI = async (
  data: string,
  receiverId: string,
  commentId: string,
  isReplyToReply: boolean,
  answeredReplyId: string
) => {
  return axiosInstance.post(
    `${url}/${commentId}?isReplyToReply=${isReplyToReply}&answeredReplyId=${answeredReplyId}`,
    {
      body: data,
      receiverId: receiverId,
    }
  );
};

export const deleteReplyAPI = async (replyId: string) => {
  return axiosInstance.delete(`${url}/${replyId}`);
};
