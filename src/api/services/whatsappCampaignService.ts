/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../axiosConfig";
import axios from "axios";

/* Service to call the WhatsApp Campaign API */

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
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // Re-throw the error to be handled by the caller
  }
};

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
    throw error;
  }
};

export const createWhatsAppTemplateService = async (templateData: any) => {
  try {
    const response = await axiosInstance.post(
      "https://ab4a3a5f-d56c-471a-9d3a-0fccbef46219.mock.pstmn.io/whatsapp/template",
      templateData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating WhatsApp template:", error);
    throw error;
  }
};

export const downloadSampleCsvService = async (templateId: string) => {
  try {
    const response = await axiosInstance.get(
      `https://ab4a3a5f-d56c-471a-9d3a-0fccbef46219.mock.pstmn.io/whatsapp/campaign-csv/${templateId}`,
      {
        responseType: 'blob', // Important for handling binary CSV data
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error downloading sample CSV:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

interface UploadOptions {
  file?: File;
  integrationId: string;
  mediaUrl?: string;
}

interface UploadResponse {
  fileHandle: string;
}

export const uploadWhatsAppMediaService = async (
  options: UploadOptions
): Promise<UploadResponse> => {
  const formData = new FormData();

  formData.append("integrationId", options.integrationId);

  if (options.file) {
    formData.append("file", options.file);
  }

  if (options.mediaUrl) {
    formData.append("mediaUrl", options.mediaUrl);
  }

  try {
    const response = await axiosInstance.post<UploadResponse>(
      // "/whatsapp/media/upload",.
      "https://ab4a3a5f-d56c-471a-9d3a-0fccbef46219.mock.pstmn.io/whatsapp/media/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${options.integrationId}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Upload failed:", error.response?.data || error.message);
    }
    throw new Error("Failed to upload media");
  }
};
