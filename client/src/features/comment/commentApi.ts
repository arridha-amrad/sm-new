import axiosInstance from "../../utils/axiosInterceptor";
import { CreateCommentDTO } from "./IComment";

const url = "/api/comment";

export const createCommentAPI = async (dto: CreateCommentDTO) => {
  return axiosInstance.post(`${url}/${dto.postId}`, {
    body: dto.data,
  });
};

export const likeCommentAPI = async (commentId: string) => {
  return axiosInstance.post(`${url}/like/${commentId}`);
};

export const deleteCommentAPI = async (commentId: string) => {
  return axiosInstance.delete(`${url}/${commentId}`);
};

export const updateCommentAPI = async (data: string, commentId: string) => {
  return axiosInstance.put(`${url}/${commentId}`, data);
};
