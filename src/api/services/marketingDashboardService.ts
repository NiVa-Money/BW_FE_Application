import axiosInstance from "../axiosConfig";

export const fetchMarketingInsightsService = async (
    brandName: string,
    country: string,
    competitors: string[],
    nextUpdateInHours: number,
    nextKeywords: string[],
    trendKeywords: string[]
  ) => {
    try {
      const response = await axiosInstance.post(`/marketing/insights`, {
        brandName,
        country,
        competitors,
        nextUpdateInHours,
        nextKeywords,
        trendKeywords
      });
  
      return response.data;
    } catch (error) {
      console.error("Error fetching marketing insights:", error);
      throw error;
    }
  };