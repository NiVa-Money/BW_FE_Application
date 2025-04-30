/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../axiosConfig";

export const getHumanPerformance = async (payload: any) => {
  try {
    const response = await axiosInstance.get(`/dashboard/human-matrics`, {
      params: payload,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in getHumanPerformance:", error);
    throw new Error("Failed to fetch human performance data");
  }
};

export const getAiAgentPerformance = async (payload: any) => {
  try {
    const response = await axiosInstance.get(`/dashboard/ai-agent-matrics`, {
      params: payload,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in getHumanPerformance:", error);
    throw new Error("Failed to fetch human performance data");
  }
};

export const getCustomerSentimentAnalysis = async (payload: any) => {
  try {
    const response = await axiosInstance.get(
      `/dashboard/customer-sentiment-analysis`,
      { params: payload }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error in getCustomerSentimentAnalysis:", error);
    throw new Error("Failed to fetch customer sentiment data");
  }
};

export const getNetPromoterScore = async (payload: any) => {
  try {
    const response = await axiosInstance.get(`/dashboard/net-promoter-score`, {
      params: payload,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in getNetPromoterScore:", error);
    throw new Error("Failed to fetch net promoter score data");
  }
};

export const getAverageHandlingTimeMetrics = async (payload: any) => {
  try {
    const response = await axiosInstance.get(
      `/dashboard/average-handlingtime-matrics`,
      { params: payload }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error in getAverageHandlingTimeMetrics:", error);
    throw new Error("Failed to fetch average handling time data");
  }
};

export const getChannelsResolvedConversation = async (payload: any) => {
  try {
    const response = await axiosInstance.get(
      `/dashboard/channels-resolved-conversation`,
      { params: payload }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error in getChannelsResolvedConversation:", error);
    throw new Error("Failed to fetch channels resolved conversation data");
  }
};

export const getChannelWiseConversation = async (payload: any) => {
  try {
    const response = await axiosInstance.get(
      `/dashboard/channelWiseConversation`,
      { params: payload }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error in getChannelWiseConversation:", error);
    throw new Error("Failed to fetch channel-wise conversation data");
  }
};

export const getEscalationRateMetrics = async (payload: any) => {
  try {
    const response = await axiosInstance.get(
      `/dashboard/escalationRateMetrics`,
      { params: payload }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error in getEscalationRateMetrics:", error);
    throw new Error("Failed to fetch escalation rate metrics data");
  }
};

export const getResolutionRate = async (payload: any) => {
  try {
    const response = await axiosInstance.get(`/dashboard/resolution-rate`, {
      params: payload,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in getResolutionRate:", error);
    throw new Error("Failed to fetch resolution rate data");
  }
};

export const getLiveVsEnded = async (payload: any) => {
  try {
    const response = await axiosInstance.get(`/dashboard/live-vs-ended`, {
      params: payload,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in getLiveVsEnded:", error);
    throw new Error("Failed to fetch live vs ended data");
  }
};

export const getAiVsHuman = async (payload: any) => {
  try {
    const response = await axiosInstance.get(`/dashboard/ai-vs-human`, {
      params: payload,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in getAiVsHuman:", error);
    throw new Error("Failed to fetch AI vs human data");
  }
};

export const getConsumedVsTotalMessage = async (payload: any) => {
  try {
    const response = await axiosInstance.get(
      `/dashboard/consumed-vs-totalmessage`,
      { params: payload }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error in getConsumedVsTotalMessage:", error);
    throw new Error("Failed to fetch consumed vs total message data");
  }
};

export const getEscalationRate = async (payload: any) => {
  try {
    const response = await axiosInstance.get(`/dashboard/escalationRate`, {
      params: payload,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in getEscalationRate:", error);
    throw new Error("Failed to fetch escalation rate data");
  }
};
