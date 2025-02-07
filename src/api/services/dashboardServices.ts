import axiosInstance from "../axiosConfig";

export const dashBoardMetricService = async (payload: any) => {
  try {
    const response = await axiosInstance.get(`user/metrics?=${payload}`, {});
    return response.data;
  } catch (error: any) {
    console.log("e", error);
    throw new Error("Error fetching user profile");
  }
};
