import axiosInstance from "../axiosConfig";


export const getMarketingInsightsService = async (
  status: "active" | "inactive" | "pending" = "active"
) => {
  try {
    const response = await axiosInstance.get("/marketing/insights", {
      params: { status },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching marketing insights:", error);
    throw error;
  }
};

export const fetchMarketingInsightsService = async (payload) => {
  try {
    const response = await axiosInstance.post(`/marketing/insights`, payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching marketing insights:", error);
    throw error;
  }
};

export const fetchCompetitorsService = async (company) => {
  try {
    const response = await axiosInstance.post(
      "/marketing/fetch-competitors",
      company
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching competitors:", error);
    throw error;
  }
};

