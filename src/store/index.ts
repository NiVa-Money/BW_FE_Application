import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import botProfileReducers from "./reducers/botReducers";
import rootSaga from "./sagas";
import whatsappCampaignReducer, {
  whatsappTemplateReducer,
} from "./reducers/whatsappCampaignReducer";
import {
  integrationReducer,
  whatsappcrudReducer,
} from "./reducers/integrationReducers";
import userChatReducers from "./reducers/conversationReducers";
import { whatsappDashboardReducer } from "./reducers/whatsappDashboardReducers";
import { shopifyDashboardReducer } from "./reducers/reportReducers";
import usersReducers from "./reducers/usersReducers";
import SubscriptionReducer from "./reducers/subscriptionReducer";
const sagaMiddleware = createSagaMiddleware();

const rootReducer = {
  bot: botProfileReducers,
  integration: integrationReducer,
  crudIntegration: whatsappcrudReducer,
  whatsappCampaign: whatsappCampaignReducer,
  whatsappTemplates: whatsappTemplateReducer,
  whatsappDashboard: whatsappDashboardReducer,
  shopifyDashboard: shopifyDashboardReducer,
  userChat: userChatReducers,
  users: usersReducers,
  subscription: SubscriptionReducer,
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
