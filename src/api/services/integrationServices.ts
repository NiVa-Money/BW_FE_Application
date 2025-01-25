/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '../axiosConfig';

export const saveWhatsappService = async (data: any) => {
  const response = await axiosInstance.post("/whatsapp/save", data);
  return response.data;
};
