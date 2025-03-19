import axiosInstance from "../axiosConfig";

export const generateTextToVideoService = async (payload) => {
  try {
    const response = await axiosInstance.post("/text-to-video", payload);
    return response.data;
  } catch {
    throw new Error("Error generating video");
  }
};

export const fetchAllTextToVideosService = async () => {
  try {
    const response = await axiosInstance.get("/text-to-video");
    return response.data;
  } catch {
    throw new Error("Error fetching all text-to-video data");
  }
};

export const enhancePromptService = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/text-to-video/prompt/enhance",
      payload
    );
    return response.data;
  } catch (error) {
    // You can handle more specific error messages here
    throw new Error(
      error.response?.data?.message || "Error enhancing text-to-video prompt"
    );
  }
};
