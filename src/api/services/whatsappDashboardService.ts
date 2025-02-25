/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import axiosInstance from "../axiosConfig";

export const whatsAppDashboardService = async (
  campaignId: string,
  startDate: Date,
  endDate: Date
): Promise<any> => {
  // Replace `any` with your expected response type if available
  try {
    const response = await axiosInstance.post("/marketing/whatsapp/dashboard", {
      campaignId,
      startDate,
      endDate,
    });

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
