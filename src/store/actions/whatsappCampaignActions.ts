/* eslint-disable @typescript-eslint/no-explicit-any */

import { CREATE_WHATSAPP_CAMPAIGN } from "../actionTypes/whatsappCampaignTypes";

export const createWhatsAppCampaignAction = (payload: any) => ({
  type: CREATE_WHATSAPP_CAMPAIGN,
  payload,
});
