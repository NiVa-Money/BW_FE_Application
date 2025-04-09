/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
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

export const getWhatsAppChatsService = async (payload: {
  botId: string;
  adminPhoneNumberId: string;
  userPhoneNumberId: string;
  aiLevel: any;
  humanLevel: any;
  orderName?: string;
  phoneNumber?: string;
  skipLoader?: boolean;
}) => {
  const { ...params } = payload;

  try {
    const response = await axiosInstance.get(`/whatsapp/chats`, {
      params,
      skipLoader: true,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    } else {
      return {
        status: "error",
        message: error.message || "Error retrieving WhatsApp chats",
      };
    }
  }
};

// export const getWhatsAppChatsService = async (payload: {
//   botId: string;
//   adminPhoneNumberId: string;
//   userPhoneNumberId: string;
//   aiLevel;
//   humanLevel;
// }) => {
//   try {
//     const response = await axiosInstance.get(`/whatsapp/chats`, {
//       params: payload,
//     });
//     return response.data;
//   } catch (error: any) {
//     if (error.response?.data) {
//       return error.response.data;
//     } else {
//       return {
//         status: "error",
//         message: error.message || "Error retrieving WhatsApp chats",
//       };
//     }
//   }
// };

export const markWhatsAppMessageAsRead = async (
  userPhoneId: string,
  adminPhoneNumberId: string
): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      "/whatsapp/messages/mark_as_read",
      {
        userPhoneId,
        adminPhoneNumberId,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error marking WhatsApp message as read:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const markWhatsAppMessageAsUnread = async (
  userPhoneId: string,
  adminPhoneNumberId: string
): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      "/whatsapp/messages/mark_as_unread",
      {
        userPhoneId,
        adminPhoneNumberId,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error marking WhatsApp message as unread:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const blockWhatsAppUserService = async (payload: {
  adminPhoneNumberId: string;
  userPhoneId: string;
  reason: string;
}): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/whatsapp/block-users`, payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error blocking user on WhatsApp:",
        error.response?.data || error.message
      );
      // Optionally return the server data if it exists
      if (error.response?.data) {
        return error.response.data;
      }
    } else {
      console.error("Unexpected error blocking user on WhatsApp:", error);
    }
    throw error;
  }
};

export const unblockWhatsAppUserService = async (payload: {
  adminPhoneNumberId: string;
  userPhoneId: string;
}): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      `/whatsapp/unblock-users`,
      payload
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error unblocking user on WhatsApp:",
        error.response?.data || error.message
      );
      // Optionally return the server data if it exists
      if (error.response?.data) {
        return error.response.data;
      }
    } else {
      console.error("Unexpected error unblocking user on WhatsApp:", error);
    }
    throw error;
  }
};
