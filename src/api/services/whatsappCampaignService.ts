/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../axiosConfig";
import axios from "axios";

/* Service to call the WhatsApp Campaign API */

export const createWhatsAppCampaignService = async (campaignData: any) => {
  try {
    const response = await axiosInstance.post(
      "/whatsapp/campaign",
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
export const uploadWhatsAppContactsService = async (
  templateId: string,
  formData: FormData
) => {
  try {
    const response = await axiosInstance.post(
      `/whatsapp/upload-contacts/${templateId}`,
      formData
    );
    return response.data; // Returns the response data from the API
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error uploading WhatsApp contacts:",
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
    const response = await axiosInstance.get(`/whatsapp/campaign`);
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
      "/whatsapp/template",
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
      `/whatsapp/sample-csv/${templateId}`,
      {
        responseType: "blob", // Important for handling binary CSV data
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

export const pauseWhatsAppCampaignService = async (campaignId: string) => {
  try {
    const response = await axiosInstance.patch(
      `/whatsapp/campaign/${campaignId}/pause`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error pausing WhatsApp campaign:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const resumeWhatsAppCampaignService = async (campaignId: string) => {
  try {
    const response = await axiosInstance.post(`/whatsapp/${campaignId}/resume`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error pausing WhatsApp campaign:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const editWhatsAppCampaignService = async (
  campaignId: string,
  campaignData: any
) => {
  try {
    const response = await axiosInstance.patch(
      `/whatsapp/campaign/${campaignId}`,
      campaignData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error editing WhatsApp campaign:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // Re-throw the error to be handled by the caller
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
      "/whatsapp/media/upload",
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
