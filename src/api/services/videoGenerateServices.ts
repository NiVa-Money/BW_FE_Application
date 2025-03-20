import axiosInstance from "../axiosConfig";

export const generateTextToVideoService = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/media-generation/text-to-video",
      payload
    );
    return response.data;
  } catch {
    throw new Error("Error generating video");
  }
};

export const fetchAllTextToVideosService = async () => {
  try {
    const response = await axiosInstance.get("/media-generation/text-to-video");
    return response.data;
  } catch {
    throw new Error("Error fetching all text-to-video data");
  }
};

export const enhancePromptService = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/media-generation/prompt/enhance",
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

export const deleteVideoService = async (requestId) => {
  try {
    const response = await axiosInstance.delete(
      `/media-generation/text-to-video/${requestId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error deleting text-to-video request"
    );
  }
};

export const generateTextToImageService = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/media-generation/text-to-image",
      payload
    );
    return response.data;
  } catch {
    throw new Error("Error generating image");
  }
};

export const fetchAllTextToImagesService = async () => {
  try {
    const response = await axiosInstance.get("/media-generation/text-to-image");
    return response.data;
  } catch {
    throw new Error("Error fetching all text-to-image data");
  }
};

export const deleteImageService = async (requestId) => {
  try {
    const response = await axiosInstance.delete(
      `/media-generation/text-to-image/${requestId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error deleting text-to-image request"
    );
  }
}