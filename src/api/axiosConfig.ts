import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});
axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    config.headers = {
      ...config.headers,
      Accept: 'application/json',
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const responseErrorInterceptor = (error: any) => {
  return Promise.reject(error);
};

const responseInterceptor = (response: any) => {
  return response;
};

axiosInstance.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
);

export default axiosInstance;
