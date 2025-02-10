/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FETCH_WHATSAPP_DASHBOARD_REQUEST,
  FETCH_WHATSAPP_MESSAGES_REQUEST,
} from "../actionTypes/whatsappDashboardActionTypes";

export const fetchWhatsAppDashboardRequest = (campaignId: any) => ({
  type: FETCH_WHATSAPP_DASHBOARD_REQUEST,
  payload: campaignId,
});

export const fetchWhatsAppMessagesRequest = () => ({
  type: FETCH_WHATSAPP_MESSAGES_REQUEST,
});
