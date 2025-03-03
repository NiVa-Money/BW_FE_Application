/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CREATE_WHATSAPP_CAMPAIGN,
  CREATE_WHATSAPP_TEMPLATE,
  FETCH_WHATSAPP_CAMPAIGNS,
  FETCH_WHATSAPP_TEMPLATES,
} from "../actionTypes/whatsappCampaignTypes";

export const createWhatsAppCampaignAction = (payload: any) => ({
  type: CREATE_WHATSAPP_CAMPAIGN,
  payload,
});

export const fetchCampaignsAction = (payload: any) => ({
  type: FETCH_WHATSAPP_CAMPAIGNS,
  payload,
}); 

export const fetchWhatsAppTemplatesAction = (payload: any) => ({
  type: FETCH_WHATSAPP_TEMPLATES,
  payload,
});

export const createWhatsAppTemplateAction = (payload: any) => ({
  type: CREATE_WHATSAPP_TEMPLATE,
  payload,
});
