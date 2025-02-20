import axiosInstance from "../axiosConfig";

export const dashBoardMetricService = async (payload: any) => {
  try {
    const response = await axiosInstance.get(`user/metrics?=${payload}`, {});
    return response.data;
  } catch (error: any) {
    throw new Error("Error fetching user profile");
  }
};

export const dashBoardDataService = async (payload: any) => {
  try {
    const response = await axiosInstance.post(`/dashboard/static`, payload);
    return response.data;
  } catch (error: any) {
    console.error("Failed on dashBoardDataService: ", error);
    throw new Error("Error while fetching dashBoardDataService");
  }
};
