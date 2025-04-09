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
    export: {
      data: null,
      loader: false,
    },
    test: { data: {}, loader: false },
  },

  whatsappCampaign: {
    loading: false,
    success: false,
    error: null,
    campaignData: null,
  },

  integration: {
    crudIntegration: {
      loading: false,
      data: null,
    },
    whatsappIntegration: {
      secretToken: "",
      webhookUrl: "",
    },
  },

  whatsappTemplates: {
    loading: false,
    templates: [],
    error: null,
    success: false,
    templateData: null,
  },

  whatsappDashboard: {
    loading: false,
    error: null,
    dashboardData: [],
    messages: [],
    campaignInsights: [],
  },

  shopifyDashboard: {
    loading: false,
    error: null,
    shopifyData: [],
  },

  userChat: {
    session: {
      data: [],
      loader: false,
    },
    allSession: {
      data: [],
      loader: false,
    },
    allSessionLive: {
      data: [],
      loader: false,
    },

    sessionChat: {
      data: [],
      sessionId: null,
      loader: false,
      lastMessageFrom: "receiver",
    },
    advanceFeature: {
      data: {},
      loader: false,
    },
  },
  subscription: {
    plans: { loader: false, data: [] }
  }
};
