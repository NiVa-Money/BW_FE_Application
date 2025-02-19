/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../axiosConfig";

export const fetchShopifyDashboardService = async (
  startDate: string,
  endDate: string
) => {
  try {
    const response = await axiosInstance.get(`/shopify/dashboard`, {
      params: { startDate, endDate },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching Shopify dashboard data:", error);
    throw error;
  }
};


export const fetchShopifyOrdersService = async (
  startDate: string,
  endDate: string,
  page: number
) => {
  try {
    const response = await axiosInstance.get(`/shopify/orders`, {
      params: { startDate, endDate, page },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching Shopify orders:", error);
    throw error;
  }
};