import axiosInstance from '../../utils/axiosInterceptor';
import { INotification } from '../notification/INotification';
import { Post, UpdatePostDTO } from './IPost';

const url = '/api/post';

export const createPostAPI = async (data: FormData) => {
  return axiosInstance.post<{ post: Post }>(`${url}`, data);
};

export const getPostByIdAPI = async (postId: string) => {
  return axiosInstance.get<{ post: Post }>(`${url}/${postId}`);
};

export const likePostAPI = async (postId: string) => {
  return axiosInstance.post<{ post: Post; notification: INotification }>(
    `${url}/like/${postId}`
  );
};

export const deletePostAPI = async (postId: string) => {
  return axiosInstance.delete(`${url}/${postId}`);
};

export const updatePostAPI = async (dto: UpdatePostDTO) => {
  return axiosInstance.put<{ post: Post }>(`${url}/${dto.postId}`, {
    body: dto.body,
  });
};
