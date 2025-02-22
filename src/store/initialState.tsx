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
<<<<<<< HEAD
  },
=======
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

>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
  whatsappCampaign: {
    loading: false,
    success: false,
    error: null,
<<<<<<< HEAD
    // campaignId: "",
  },
  whatsappIntegration: {
    secretToken: "",
    webhookUrl: "",
    error: null,
=======
    campaignData: null,
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
  },

  integration: {
    crudIntegration: {
      loading: false,
      data: null,
<<<<<<< HEAD
      error: null,
=======
    },
    whatsappIntegration: {
      secretToken: "",
      webhookUrl: "",
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
    },
  },

  whatsappTemplates: {
    loading: false,
    templates: [],
    error: null,
    success: false,
  },
<<<<<<< HEAD
=======

  whatsappDashboard: {
    loading: false,
    error: null,
    dashboardData: [],
    messages: [],
    campaignInsights : [],
  },

  shopifyDashboard : {
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
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
};
