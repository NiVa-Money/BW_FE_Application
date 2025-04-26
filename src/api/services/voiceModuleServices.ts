import axios from "axios";
import axiosInstance from "../axiosConfig";

export const createVoiceAgentService = async (agentData: object) => {
  try {
    const response = await axiosInstance.post(
      "https://vo-backend.onrender.com/voice-agent",
      agentData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error creating voice agent:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const getAllVoiceAgentsService = async () => {
  try {
    const response = await axiosInstance.get(
      "https://vo-backend.onrender.com/voice-agent"
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching voice agents:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const getVoiceAgentByIdService = async (agentId: string) => {
  try {
    const response = await axiosInstance.get(
      `https://vo-backend.onrender.com/voice-agent/${agentId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching voice agent:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const updateVoiceAgentService = async (
  agentId: string,
  updateData: object
) => {
  try {
    const response = await axiosInstance.put(
      `https://vo-backend.onrender.com/voice-agent/${agentId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error updating voice agent:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const deleteVoiceAgentService = async (agentId: string) => {
  try {
    const response = await axiosInstance.delete(
      `https://vo-backend.onrender.com/voice-agent/${agentId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error deleting voice agent:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

interface UploadKBResponse {
  filename: string;
}

export const uploadKBService = async (
  formData: FormData
): Promise<UploadKBResponse> => {
  try {
    const response = await axiosInstance.post(
      "https://vo-backend.onrender.com/voice-agent/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading KB:", error);
    throw error;
  }
};

interface UploadUrlPayload {
  name: string;
  language: string;
  style: string;
  knowledgeBase: string;
}

interface UploadUrlResponse {
  ULI: string;
}

export const uploadUrlService = async (
  payload: UploadUrlPayload
): Promise<UploadUrlResponse> => {
  try {
    const response = await axiosInstance.post(
      "https://vo-backend.onrender.com/voice-agent/url",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading URL:", error);
    throw error;
  }
};
