import axiosInstance from "../../utils/axiosInterceptor";
import { LoginDTO, RegisterDTO } from "./IAuthentication";

const url = "/api/auth";

export const registerAPI = async (data: RegisterDTO) => {
  return axiosInstance.post<{ message: string }>(`${url}/register`, data);
};

export const loginAPI = async (data: LoginDTO) => {
  return axiosInstance.post(`${url}/login`, data);
};

export const logoutAPI = async () => {
  return axiosInstance.post(`${url}/logout`);
};
