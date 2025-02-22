/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../axiosConfig";

export const saveWhatsappService = async (data: any) => {
  const response = await axiosInstance.post("/whatsapp/save", data);
  return response.data;
};

export const updateWhatsappService = async (data: any) => {
  const response = await axiosInstance.put("/whatsapp/update", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteWhatsappService = async (id: string) => {
  const response = await axiosInstance.delete(`/whatsapp/delete?id=${id}`);
  return response.data;
};


<<<<<<< HEAD
export const fetchWhatsappData = async (botId: string) => {
=======
export const getWhatsappData = async (botId: string) => {
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
  const response = await axiosInstance.get(`/whatsapp/get`, {
    params: { botId },
  });
  return response.data;
};