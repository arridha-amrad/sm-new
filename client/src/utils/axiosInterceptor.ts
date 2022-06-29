import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import configVariables from '../config';

const baseURL = configVariables.serverOrigin;

let token = '';

export const getToken = () => token;
export const setToken = (newToken: string) => (token = newToken);

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config.headers!['Content-Type'] = 'application/json';
    config.headers!['Authorization'] = getToken();
    return config;
  },
  (error) => {
    console.log('err status : ', error.response.status);
    Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: any) => {
    if (error?.response?.status === 401) {
      const prevRequest = error.config;
      return axiosInstance
        .get<{ token: string }>('/api/user/refresh-token')
        .then(({ data }) => {
          setToken(data.token);
          prevRequest.headers['Authorization'] = data.token;
          return axiosInstance(prevRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
