import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import botProfileReducers from "./reducers/botReducers";
import rootSaga from "./sagas";
import whatsappCampaignReducer from "./reducers/whatsappCampaignReducer";
import {
  integrationReducer,
  whatsappcrudReducer,
} from "./reducers/integrationReducers";
const sagaMiddleware = createSagaMiddleware();

const rootReducer = {
  bot: botProfileReducers,
  integration: integrationReducer,
  crudIntegration: whatsappcrudReducer,
  whatsappCampaign: whatsappCampaignReducer,
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
