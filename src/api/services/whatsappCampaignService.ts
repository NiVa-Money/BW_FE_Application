import axiosInstance from "../axiosConfig";
import axios from "axios";

/* Service to call the WhatsApp Campaign API */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createWhatsAppCampaignService = async (campaignData: any) => {
  try {
    const response = await axiosInstance.post('/marketing/Campaigns/whatsapp', campaignData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error creating WhatsApp campaign:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error; // Re-throw the error to be handled by the caller
  }
};
