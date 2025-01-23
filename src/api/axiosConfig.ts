<<<<<<< Updated upstream
import axios from 'axios';
import { Message } from '../../node_modules/postcss/lib/result.d';
import { useSnackbar } from '../hooks/useSnackbar';
import { notifySuccess } from '../components/Toast';
export const publicBaseUrl = "https://botwot-691156478708.us-central1.run.app"
=======
import axios from "axios";
import { Message } from "../../node_modules/postcss/lib/result.d";
import { useSnackbar } from "../hooks/useSnackbar";
import { notifySuccess } from "../components/Toast";
export const publicBaseUrl = "https://uatapi.botwot.io";
>>>>>>> Stashed changes
const axiosInstance = axios.create({
  baseURL: publicBaseUrl,
});
axiosInstance.interceptors.request.use(
  (config: any) => {
<<<<<<< Updated upstream
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmM4Njg0MjE3NmM5NmI2ODNjMTM4MDkiLCJlbWFpbElkIjoiYmF0cmFzdWRoYW5zaHUwOUBnbWFpbC5jb20iLCJpYXQiOjE3MzcxNDAxNDJ9.0AWaGPUQipFPF-r6tHYgb2bP_l318ovGzVm1h8sp4Tw';
=======
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmM4Njg0MjE3NmM5NmI2ODNjMTM4MDkiLCJlbWFpbElkIjoiYmF0cmFzdWRoYW5zaHUwOUBnbWFpbC5jb20iLCJpYXQiOjE3MzcxNDAxNDJ9.0AWaGPUQipFPF-r6tHYgb2bP_l318ovGzVm1h8sp4Tw";
>>>>>>> Stashed changes
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    config.headers = {
      ...config.headers,
      Accept: "application/json",
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const responseErrorInterceptor = (error: any) => {
<<<<<<< Updated upstream
  console.log('er',error)
=======
  console.log("er", error);
>>>>>>> Stashed changes
  return Promise.reject(error);
};

const responseInterceptor = (response: any) => {
<<<<<<< Updated upstream
  if(response?.status===200 ||201){
    notifySuccess(response.data.message)
    console.log('hi',response.data)
  }
  console.log('hi',response)
=======
  if (response?.status === 200 || 201) {
    notifySuccess(response.data.message);
    console.log("hi", response.data);
  }
  console.log("hi", response);
>>>>>>> Stashed changes
  return response;
};

axiosInstance.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
);

export default axiosInstance;
