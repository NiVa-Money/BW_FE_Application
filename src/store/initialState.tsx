/* eslint-disable @typescript-eslint/no-explicit-any */
export const initialState: any = {
  chat: {
    messages: [],
  },
  bot: {
    create: {
      data: null,
      loader: false,
    },
    edit: {
      data: null,
      loader: false,
    },
    delete: {
      data: null,
      loader: false,
    },
    lists: {
      data: null,
      loader: false,
    },
  },

  whatsappCampaign: {
    loading: false,
    success: false,
    error: null,
    // campaignId: "",
  },
  whatsappIntegration: {
    secretToken: "",
    webhookUrl: "",
    error: null,
  },

  integration: {
    crudIntegration: {
      loading: false,
      data: null,
      error: null,
    },
  },

  whatsappTemplates: {
    loading: false,
    templates: [],
    error: null,
    success: false,
  },
};
