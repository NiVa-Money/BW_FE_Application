/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../axiosConfig";

export const getUserAllSessionService = async (payload: any) => {
  try {
    const response = await axiosInstance.post(`/user/getSession`, payload);
    return response.data;
  } catch {
    throw new Error("Error: Getting user all session");
  }
};

export const getUserAllSessionLiveService = async (payload: any) => {
  try {
    const response = await axiosInstance.post(`/user/getLiveSession`, payload);
    return response.data;
  } catch {
    throw new Error("Error: Getting user all session");
  }
};

export const getAdvanceFeatureService = async (payload: any) => {
  try {
    const response = await axiosInstance.post(`/user/chat-analysis`, payload);
    return response.data;
  } catch (error) {
    console.log("error", error);
  }
};

export const enableWhatsAppManualModeService = async (payload: {
  botId: string;
  adminPhoneNumberId: string;
  userPhoneNumberId: string;
  action: "append" | "remove"; // now we allow both
}) => {
  try {
    // We pass the entire payload, including action, directly
    const response = await axiosInstance.post(`/whatsapp/manual-mode`, payload);
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw new Error("Error: Setting WhatsApp manual mode");
  }
};

export const sendWhatsAppManualReplyService = async (payload: {
  botId: string;
  adminPhoneNumberId: string;
  userPhoneNumberId: string;
  message: string;
}) => {
  try {
    const response = await axiosInstance.post(
      "/whatsapp/manual-reply",
      payload
    );
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw new Error("Error: Sending WhatsApp manual reply");
  }
};
