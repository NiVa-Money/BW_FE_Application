/* eslint-disable @typescript-eslint/no-explicit-any */

<<<<<<< HEAD
import { CREATE_WHATSAPP_CAMPAIGN, CREATE_WHATSAPP_TEMPLATE, FETCH_WHATSAPP_TEMPLATES } from "../actionTypes/whatsappCampaignTypes";
=======
import {
  CREATE_WHATSAPP_CAMPAIGN,
  CREATE_WHATSAPP_TEMPLATE,
  FETCH_WHATSAPP_CAMPAIGNS,
  FETCH_WHATSAPP_TEMPLATES,
} from "../actionTypes/whatsappCampaignTypes";
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161

export const createWhatsAppCampaignAction = (payload: any) => ({
  type: CREATE_WHATSAPP_CAMPAIGN,
  payload,
});

<<<<<<< HEAD
=======
export const fetchCampaignsAction = (payload: any) => ({
  type: FETCH_WHATSAPP_CAMPAIGNS,
  payload,
}); 
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161

export const fetchWhatsAppTemplatesAction = (payload: any) => ({
  type: FETCH_WHATSAPP_TEMPLATES,
  payload,
});

export const createWhatsAppTemplateAction = (payload: any) => ({
  type: CREATE_WHATSAPP_TEMPLATE,
  payload,
});
