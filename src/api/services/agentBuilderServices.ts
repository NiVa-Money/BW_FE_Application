/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../axiosConfig";

// Append Knowledge Base to Bot Profile
export const appendKnowledgeBaseService = async (
  botId: string,
  kbId: string,
  payload: any
) => {
  try {
    const response = await axiosInstance.post(
      `/bot/botProfile/${botId}/appendKb`,
      {
        kbId,
        ...payload,
      }
    );
    return response.data;
  } catch {
    throw new Error("Error appending knowledge base to bot profile");
  }
};

// Create a New Bot Profile
export const createBotProfileService = async (payload: any) => {
  try {
    const response = await axiosInstance.post("/bot/createBotProfile", payload);
    return response.data;
  } catch {
    throw new Error("Error creating bot profile");
  }
};

// Edit an Existing Bot Profile
export const editBotProfileService = async (botId: string, payload: any) => {
  try {
    const response = await axiosInstance.put(
      `/bot/editBotProfile/${botId}`,
      payload
    );
    return response.data;
  } catch {
    throw new Error("Error editing bot profile");
  }
};

// Detach Knowledge Base from Bot Profile
export const detachKnowledgeBaseService = async (
  botId: string,
  kbId: string
) => {
  try {
    const response = await axiosInstance.patch(
      `/bot/${botId}/detachKB/${kbId}`
    );
    return response.data;
  } catch {
    throw new Error("Error detaching knowledge base from bot profile");
  }
};

// Delete Knowledge Base from Bot Profile
export const deleteKnowledgeBaseService = async (
  botId: string,
  kbId: string
) => {
  try {
    const response = await axiosInstance.delete(
      `/bot/${botId}/deleteKB/${kbId}`
    );
    return response.data;
  } catch {
    throw new Error("Error deleting knowledge base from bot profile");
  }
};

// Get Bot Profile by Bot ID
export const getBotProfileService = async (botId: string) => {
  try {
    const response = await axiosInstance.get(`/bot/getBotProfile/${botId}`);
    return response.data;
  } catch {
    throw new Error("Error fetching bot profile");
  }
};

// Get All Bots
export const getAllBotsService = async () => {
  try {
    const response = await axiosInstance.get("/bot/getAllBots");
    return response.data;
  } catch {
    throw new Error("Error fetching all bots");
  }
};

// Soft Delete a Bot Profile
export const deleteBotProfileService = async (payload: any) => {
  try {
    const response = await axiosInstance.put("/bot/deleteBotProfile", payload);
    return response.data;
  } catch {
    throw new Error("Error soft deleting bot profile");
  }
};

// Export Bot Profile
export const exportBotProfileService = async (payload: any) => {
  try {
    const response = await axiosInstance.post("/bot/widget/export", {
      botId: payload.botId,
      userId: payload?.userId,
    });
    return response.data;
  } catch {
    throw new Error("Error exporting bot profile");
  }
};
