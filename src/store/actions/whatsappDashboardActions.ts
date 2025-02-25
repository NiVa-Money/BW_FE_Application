 
import {
  FETCH_WHATSAPP_DASHBOARD_REQUEST,
  FETCH_WHATSAPP_INSIGHTS_REQUEST,
  FETCH_WHATSAPP_MESSAGES_REQUEST,
} from "../actionTypes/whatsappDashboardActionTypes";

export const fetchWhatsAppDashboardRequest = (campaignId: string , startDate: string, endDate: string) => ({
  type: FETCH_WHATSAPP_DASHBOARD_REQUEST,
  payload: campaignId, startDate, endDate
});

export const fetchWhatsAppMessagesRequest = (params: {
  page: number;
  limit?: number;
  filter?: {
    campaignIds?: string[];
    receiverNumber?: string;
    status?: string;
  };
}) => ({
  type: FETCH_WHATSAPP_MESSAGES_REQUEST,
  payload: params,
});


export const fetchWhatsAppInsightsRequest = (campaignId: string) => ({
  type: FETCH_WHATSAPP_INSIGHTS_REQUEST,
  payload: campaignId,
});


