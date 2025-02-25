/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { notifyError } from "../components/Toast";

export const publicBaseUrl = "https://uatapi.botwot.io";

const axiosInstance = axios.create({
  baseURL: publicBaseUrl,
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token"); // Fetch the token on every request
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const responseErrorInterceptor = (error: any) => {
  notifyError(
    error?.response?.data?.message
      ? error?.response?.data?.message
      : "Something went wrong!"
  );

  return Promise.reject(error);
};

const responseInterceptor = (response: any) => {
  if (response?.status === 200 || response?.status === 201) {
    // notifySuccess(response.data.message);
  }
  return response;
};

axiosInstance.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
);

export default axiosInstance;
