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

// export const enableWhatsAppManualModeService = async (payload: {
//   botId: string;
//   adminPhoneNumberId: string;
//   userPhoneNumberId: string;
//   action: "append" | "remove"; // now we allow both
// }) => {
//   try {
//     // We pass the entire payload, including action, directly
//     const response = await axiosInstance.post(`/whatsapp/manual-mode`, payload);
//     return response.data;
//   } catch (error) {
//     console.log("error", error);
//     throw new Error("Error: Setting WhatsApp manual mode");
//   }
// };

export const enableWhatsAppManualModeService = async (payload: {
  botId: string;
  adminPhoneNumberId: string;
  userPhoneNumberId: string;
  action: "append" | "remove";
}) => {
  try {
    const response = await axiosInstance.post(`/whatsapp/manual-mode`, payload);
    return response.data; // If 2xx, return data as-is
  } catch (error: any) {
    // If the server returns 4xx/5xx, axios throws. Let's return the server data (if present)
    if (error.response?.data) {
      // This likely contains { status: "error", message: "User number already exists" }
      return error.response.data;
    } else {
      // Fallback if there's no error response from server
      return {
        status: "error",
        message: error.message || "Unknown error setting WhatsApp manual mode",
      };
    }
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
