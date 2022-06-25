import axiosInstance from './axiosInterceptor';

const fetcher = async (url: string) => {
  try {
    const { data } = await axiosInstance.get(url);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default fetcher;
