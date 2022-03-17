import axiosInstance from "../../utils/axiosInterceptor";
import { ReplyComment } from "./IReply";

const url = "/api/reply";

export const createReplyAPI = async (
  data: string,
  receiver: string,
  commentId: string
) => {
  return axiosInstance.post<{ reply: ReplyComment }>(`${url}/${commentId}`, {
    body: data,
    receiver,
  });
};

export const deleteReplyAPI = async (replyId: string) => {
  return axiosInstance.delete(`${url}/${replyId}`);
};
