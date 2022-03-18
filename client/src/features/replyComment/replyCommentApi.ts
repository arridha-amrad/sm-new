import axiosInstance from "../../utils/axiosInterceptor";
import { ReplyComment } from "./IReply";

const url = "/api/reply";

export const createReplyAPI = async (
  data: string,
  receiverId: string,
  commentId: string
) => {
  return axiosInstance.post(`${url}/${commentId}`, {
    body: data,
    receiverId: receiverId,
  });
};

export const deleteReplyAPI = async (replyId: string) => {
  return axiosInstance.delete(`${url}/${replyId}`);
};
