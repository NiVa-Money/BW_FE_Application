import axiosInstance from "../axiosConfig";

export const getSubscriptionService = async () => {
  try {
    const response = await axiosInstance.get(`/payment/plans`);
    return response.data;
  } catch (error: any) {
    throw new Error("Error fetching Subscription plans");
  }
};
