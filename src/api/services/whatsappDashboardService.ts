/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import axiosInstance from "../axiosConfig";

export const whatsAppDashboardService = async (
  campaignId: string,
  startDate: string,
  endDate: string
): Promise<any> => {
  // Replace `any` with your expected response type if available
  try {
    const response = await axiosInstance.post(
      "/marketing/whatsapp/dashboard/v2",
      {
        campaignId,
        startDate,
        endDate,
      }
    );

    return response.data; // Return the data from the API response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error navigating to WhatsApp dashboard:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const whatsAppDashboardMessagesService = async (params: {
  page: number;
  limit?: number;
  filter?: {
    campaignIds?: string[];
    receiverNumber?: string;
    status?: string;
  };
}) => {
  try {
    const response = await axiosInstance.post(
      "/marketing/whatsapp/messages-overview",
      params // Send full request object
    );

    return response.data; // Assuming the response contains the required data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error navigating to WhatsApp dashboard:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const whatsAppDashboardCampaignInsightsService = async (
  campaignId: string
) => {
  try {
    const response = await axiosInstance.post(
      "/marketing/whatsapp/campaign-insights",
      { campaignId } // Send as an object with a single string property
    );

    return response.data; // Assuming the response contains the required data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error navigating to WhatsApp dashboard:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const exportWhatsAppMessages = async (params: {
  page: number;
  limit?: number;
  filter?: {
    campaignIds?: string[];
    receiverNumber?: string;
    status?: string;
    intent?: string;
    sentiment?: string;
  };
}) => {
  try {
    const response = await axiosInstance.post(
      "/marketing/whatsapp/messages-overview/export",
      params,
      {
        responseType: "blob", // Required for downloading binary files
      }
    );

    // Get filename from content-disposition header (if available)
    const contentDisposition = response.headers["content-disposition"];
    const suggestedFilename =
      contentDisposition?.split("filename=")[1]?.replace(/['"]/g, "") ||
      "whatsapp-messages.xlsx";

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", suggestedFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Export failed:", error);
    throw error;
  }
};

export const sendInteractiveMessageService = async (payload: any) => {
  try {
    const response = await axiosInstance.post("/whatsapp/send-interactive-message", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to send interactive message:", error);
    throw error;
  }
};