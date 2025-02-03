import axiosInstance from "../axiosConfig";

export const createBotProfileService = async (payload: any) => {
  try {
    const response = await axiosInstance.post(
      "/user/createBotProfile",
      payload
    );
    return response.data;
  } catch (error) {
    throw new Error("Error in Creating Bot");
  }
};

export const editBotProfileService = async (payload: any) => {
  try {
    const response = await axiosInstance.post("/user/editBotProfile", payload);
    return response.data;
  } catch (error) {
    throw new Error("Error in Creating Bot");
  }
};

export const getBotsService = async (payload: any) => {
  try {
    const response = await axiosInstance.get(
      `user/getUserBotProfiles?userId=${payload}`,
      {}
    );
    return response.data;
  } catch (error: any) {
    console.log("e", error);
    throw new Error("Error fetching user profile");
  }
};

export const deleteBotService = async (payload: any) => {
  try {
    const response = await axiosInstance.put(
      `user/deleteBotProfile?botId=${payload.botId}&userId=${payload.userId}`,
      {}
    );
    return response.data;
  } catch (error: any) {
    console.log("e", error);
    throw new Error("Error Deleting Bot profile");
  }
};

export const exportBotProfileService = async (payload: any) => {
  try {
    const response = await axiosInstance.post("/user/widget/export/", {
      botId: payload.botId,
      userId: payload?.userId,
    });
    return response.data;
  } catch (error: any) {
    throw new Error("Error exporting bot");
  }
};
export const botTestService = async (payload: any) => {
  try {
    const response = await axiosInstance.post("/user/sessionChatV2", {
      data: JSON.stringify(payload),
    });
    return response.data;
  } catch (error) {
    throw new Error("Error in Creating Bot");
  }
};
