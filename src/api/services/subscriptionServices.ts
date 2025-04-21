/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../axiosConfig";

export const getSubscriptionService = async () => {
  try {
    const response = await axiosInstance.get(`/payment/plans`);
    return response.data;
  } catch (error: any) {
    throw new Error("Error fetching Subscription plans");
  }
};
export const createSubscriptionService = async (
  planId: string,
  payload: any
) => {
  try {
    const response = await axiosInstance.post(
      `/payment/subscription/${planId}`,
      payload
    );
    console.log("API response:", response);
    return response.data;
  } catch (error) {
    console.error("Error in processPayPalPaymentService:", error);
    throw new Error("Payment processing failed");
  }
};
export const capturePaymentService = async (id: string) => {
  try {
    const response = await axiosInstance.post(
      `/payment/capture-subscription/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Payment capture failed");
  }
};
