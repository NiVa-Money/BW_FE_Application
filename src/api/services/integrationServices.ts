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

export const getWhatsappData = async (botId: string) => {
  const response = await axiosInstance.get(`/whatsapp/get`, {
    params: { botId },
  });
  return response.data;
};

export const saveInstagramService = async (data: any) => {
  const response = await axiosInstance.post("/instagram", data);
  return response.data;
};

export const getInstagramData = async () => {
  const response = await axiosInstance.get(`/instagram`);
  return response.data;
};

export const editInstagramData = async (id: string, updatedData: any) => {
  const response = await axiosInstance.put(`/instagram/${id}`, updatedData);
  return response.data;
};

export const deactivateInstagramService = async (id: string) => {
  const response = await axiosInstance.patch(`/instagram/deactivate/${id}`);
  return response.data;
};
