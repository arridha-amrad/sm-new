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
    console.log('err response from interceptor: ', error.response);
    if (error.response.status === 401) {
      const prevRequest = error.config;
      return axiosInstance
        .get<{ token: string }>('/api/user/refresh-token')
        .then(({ data }) => {
          console.log('token refresh : ', data.token);
          setToken(data.token);
          prevRequest.headers['Authorization'] = data.token;
          return axios(prevRequest);
        })
        .catch((err) => {
          console.log('err from interceptor : ', err.response.data);
          if (err.response.status === 500) {
            const pathname = window.location.pathname;
            window.location.href = `/login?e=You need to login to perform this action&next=${pathname}`;
          }
          return Promise.reject(err);
        });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
