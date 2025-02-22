/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../axiosConfig";
import axios from "axios";

/* Service to call the WhatsApp Campaign API */
<<<<<<< HEAD
// eslint-disable-next-line @typescript-eslint/no-explicit-any
=======

>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
export const createWhatsAppCampaignService = async (campaignData: any) => {
  try {
    const response = await axiosInstance.post(
      "/marketing/Campaigns/whatsapp",
      campaignData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error creating WhatsApp campaign:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // Re-throw the error to be handled by the caller
  }
};

/* Service to call the CSV-to-JSON conversion API */
export const convertCsvToJsonService = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(
      "/marketing/csv-to-json",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      }
    );
    return response.data; // Assuming response contains the JSON conversion result
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error converting CSV to JSON:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // Re-throw the error to be handled by the caller
  }
};

<<<<<<< HEAD
export const WhatsAppDashboardService = async (campaignId: string) => {
  try {
    const response = await axiosInstance.post("/marketing/whatsapp/dashboard", {
      campaignId,
    });
    return response.data; // Assuming the response contains the required data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error navigating to WhatsApp dashboard:",
=======
export const campaignImageService = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(
      "/marketing/media/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      }
    );
    return response.data; // Assuming response contains the JSON conversion result
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error uploading image:",
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // Re-throw the error to be handled by the caller
  }
};

<<<<<<< HEAD

export const fetchWhatsAppTemplatesService = async (integrationId: any) => {
  try {
    const response = await axiosInstance.get(
      `/whatsapp/template?integrationId=${integrationId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching WhatsApp templates:', error);
=======
export const fetchCampaignService = async () => {
  try {
    const response = await axiosInstance.get(`/marketing/Campaigns`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching campaigns:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const fetchWhatsAppTemplatesService = async (integrationId: string) => {
  try {
    const response = await axiosInstance.get(`/whatsapp/template`, {
      params: { integrationId },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching WhatsApp templates:", error);
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
    throw error;
  }
};

export const createWhatsAppTemplateService = async (templateData: any) => {
  try {
<<<<<<< HEAD
    const response = await axiosInstance.post('/whatsapp/template', templateData);
    return response.data;
  } catch (error) {
    console.error('Error creating WhatsApp template:', error);
=======
    const response = await axiosInstance.post(
      "/whatsapp/template",
      templateData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating WhatsApp template:", error);
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
    throw error;
  }
};
