/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const getAllVoicesService = async () => {
  try {
    const response = await axiosInstance.get(
      "https://vo-backend.onrender.com/voice-agent/voice-config"
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching voices:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const recordAndCloneVoiceService = async (
  formData: FormData
): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      "https://vo-backend.onrender.com/voice-agent/record-and-clone",
      formData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error recording and cloning voice:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

type VoiceCallStatus = "Live" | "Completed" | "Failed" | "Retried";

interface CreateVoiceCallPayload {
  agentId: string;
  phoneNumber: string;
  status: VoiceCallStatus;
  transcript?: string;
  recordingUrl?: string;
  retryCount?: number;
  duration?: number;
}

interface VoiceCall {
  insights: any;
  _id: any;
  id: string;
  agentId: string;
  phoneNumber: string;
  status: VoiceCallStatus;
  transcript: string;
  recordingUrl: string;
  retryCount: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export const createVoiceCallService = async (
  data: CreateVoiceCallPayload
): Promise<VoiceCall> => {
  // Add return type
  try {
    const response = await axiosInstance.post(
      "https://vo-backend.onrender.com/voice-calls",
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error creating voice call:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const getAllVoiceCallsService = async (): Promise<VoiceCall[]> => {
  try {
    const response = await axiosInstance.get(
      "https://vo-backend.onrender.com/voice-calls"
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching voice calls:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const getVoiceCallByIdService = async (
  callId: string
): Promise<VoiceCall> => {
  try {
    const response = await axiosInstance.get(
      `https://vo-backend.onrender.com/voice-calls/${callId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching voice call:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const updateVoiceCallStatusService = async (
  callId: string,
  status: VoiceCallStatus
) => {
  try {
    const response = await axiosInstance.put(
      `https://vo-backend.onrender.com/voice-calls/${callId}/update-status`,
      { status }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error updating call status:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const transcribeVoiceCallService = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("model_id", "scribe_v1");
    formData.append("file", file);

    const response = await axios.post(
      "https://api.elevenlabs.io/v1/speech-to-text",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "xi-api-key": import.meta.env.VITE_ELEVENLABS_API_KEY,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error transcribing call:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};
