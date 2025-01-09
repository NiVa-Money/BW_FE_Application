import { toast } from "react-toastify";
import { notifyError, notifySuccess } from "../../components/Toast";
import axiosInstance from "../axiosConfig";

export const createBotProfileService = async (payload: any) => {
    try {
      const response = await axiosInstance.post(
        '/user/createBotProfile',
        payload
      );
      return response.data;
      notifySuccess('Bot Created Successfully')
    } catch (error) {
      // console.log('e',error)
      notifyError('error')
      
    toast.error('error')
      throw new Error('Error in Creating Bot');
    }
  };