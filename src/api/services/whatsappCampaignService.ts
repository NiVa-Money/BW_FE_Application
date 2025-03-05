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
      "/whatsapp/template",
      templateData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating WhatsApp template:", error);
    throw error;
  }
};

// interface UploadResponse {
//   fileHandle: any;
//   url: string;
// }

// export const uploadWhatsAppMediaService = async (
//   formData: FormData,
//   integrationId: string
// ): Promise<UploadResponse> => {
//   const response = await axiosInstance.post("/whatsapp/media/upload", formData, {
//     params: { integrationId },
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   // Now TS knows this function returns an object with shape { url: string }
//   return response.data;
// };

interface UploadResponse {
  fileHandle: string;
}

export const uploadWhatsAppMediaService = async (
  file: File, // Ensure `file` is a valid File or Blob object
  integrationId: string
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file); // Append the file
  formData.append("integrationId", integrationId); // Append the integrationId

  // Log FormData for debugging
  console.log("FormData contents:");
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  try {
    const response = await axios.post<UploadResponse>(
      "/whatsapp/media/upload", // Ensure the full URL is correct
      formData,
      {
        headers: {
          Authorization: `Bearer ${integrationId}`,
          // Axios automatically sets `Content-Type: multipart/form-data` for FormData
        },
      }
    );

    // Log the response for debugging
    console.log("API Response:", response.data);

    return response.data;
  } catch (error) {
    // Log the error for debugging
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw new Error("Failed to upload media");
  }
};
