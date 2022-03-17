import axiosInstance from "../../utils/axiosInterceptor";

const url = "/api/reply";

export const likeReplyAPI = async (replyId: string) => {
  return axiosInstance.post(`${url}/like/${replyId}`);
};
