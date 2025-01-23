import axios from 'axios';

/* Service to call the WhatsApp Campaign API */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createWhatsAppCampaignService = async (campaignData: any) => {
  const response = await axios.post('/marketing/Campaigns/whatsapp', campaignData);
  return response.data;
};
