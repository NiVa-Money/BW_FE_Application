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
    console.log("Sending API request with payload:", payload);
    const response = await axiosInstance.post(`/user/chat-analysis`, payload);
    return response.data;
  } catch (error) {
    console.error("Error calling getAdvanceFeatureService:", error);
    throw new Error("Error: Getting Advance Feature");
  }
};
