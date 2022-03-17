import axiosInstance from "../../utils/axiosInterceptor";
import { CreateCommentDTO, IComment } from "./IComment";

const url = "/api/comment";

export const createCommentAPI = async (dto: CreateCommentDTO) => {
  console.log("dto : ", dto);

  return axiosInstance.post<{ comment: IComment }>(`${url}/${dto.postId}`, {
    body: dto.data,
  });
};

export const likeCommentAPI = async (commentId: string) => {
  return axiosInstance.post<{ comment: IComment }>(`${url}/like/${commentId}`);
};

export const deleteCommentAPI = async (commentId: string) => {
  return axiosInstance.delete(`${url}/${commentId}`);
};

export const updateCommentAPI = async (data: string, commentId: string) => {
  return axiosInstance.put<{ comment: IComment }>(`${url}/${commentId}`, data);
};
