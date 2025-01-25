/* eslint-disable @typescript-eslint/no-explicit-any */
export const initialState: any = {
   chat: {
      messages: []
   },
   bot: {
      create: {
         data: null,
         loader: false
      }
   },
   whatsappCampaign: {
      loading: false,
      success: false,
      error: null,
      // campaignId: "",
   },
}