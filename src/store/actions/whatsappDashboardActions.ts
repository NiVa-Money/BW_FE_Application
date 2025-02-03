/* eslint-disable @typescript-eslint/no-explicit-any */
import { FETCH_WHATSAPP_DASHBOARD_REQUEST } from "../actionTypes/whatsappDashboardActionTypes";

export const fetchWhatsAppDashboardRequest = (campaignId: any) => ({
    type: FETCH_WHATSAPP_DASHBOARD_REQUEST,
    payload: campaignId,
  });