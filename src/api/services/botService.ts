import axiosInstance from "../axiosConfig";

export const createBotProfileService = async (payload: any) => {
    try {
      const response = await axiosInstance.post(
        '/user/createBotProfile',
        payload
      );
      return response.data;
    } catch (error) {
      throw new Error('Error in Creating Bot');
    }
  };