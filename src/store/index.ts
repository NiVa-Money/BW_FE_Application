import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import botProfileReducers from "./reducers/botReducers";
import rootSaga from "./sagas";
<<<<<<< HEAD
import whatsappCampaignReducer from "./reducers/whatsappCampaignReducer";
=======
import whatsappCampaignReducer, { whatsappTemplateReducer } from "./reducers/whatsappCampaignReducer";
import {
  integrationReducer,
  whatsappcrudReducer,
} from "./reducers/integrationReducers";
import userChatReducers from "./reducers/conversationReducers";
import { whatsappDashboardReducer } from "./reducers/whatsappDashboardReducers";
import { shopifyDashboardReducer } from "./reducers/reportReducers";
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
const sagaMiddleware = createSagaMiddleware();

const rootReducer = {
  bot: botProfileReducers,
<<<<<<< HEAD
  whatsappCampaign: whatsappCampaignReducer,
  
=======
  integration: integrationReducer,
  crudIntegration: whatsappcrudReducer,
  whatsappCampaign: whatsappCampaignReducer,
  whatsappTemplates: whatsappTemplateReducer,
  whatsappDashboard : whatsappDashboardReducer,
  shopifyDashboard : shopifyDashboardReducer, 
  userChat: userChatReducers,
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(
      sagaMiddleware
    ),
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
