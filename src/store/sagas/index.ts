import { takeEvery } from "redux-saga/effects";
import {
  CREATE_BOT,
  DELETE_BOT,
  EDIT_BOT,
  EXPORT_BOT_PROFILE,
  GET_BOTS,
  TEST_BOT,
} from "../actionTypes/botActionsTypes";
import {
  createBotSaga,
  deleteBotSaga,
  editBotSaga,
  exportBotProfileSaga,
  getBotsSaga,
  testBotSaga,
} from "./botSagas";
import {
  SAVE_WHATSAPPINT, // Ensure this is correctly defined in integrationActionTypes
  UPDATE_WHATSAPP_REQUEST,
  DELETE_WHATSAPP_REQUEST,
  GET_WHATSAPP_REQUEST,
} from "../actionTypes/integrationActionTypes";
import {
  CREATE_WHATSAPP_CAMPAIGN,
  CREATE_WHATSAPP_TEMPLATE,
  FETCH_WHATSAPP_CAMPAIGNS,
  FETCH_WHATSAPP_TEMPLATES,
} from "../actionTypes/whatsappCampaignTypes";
import {
  saveWhatsappSaga,
  updateWhatsappSaga,
  deleteWhatsappSaga,
  getWhatsappSaga,
} from "./integrationSaga";
import {
  createWhatsAppCampaignSaga,
  createWhatsAppTemplateSaga,
  fetchWhatsappCampaignsSaga,
  fetchWhatsAppTemplatesSaga,
} from "./whatsappCampaignSaga";
import {
  FETCH_WHATSAPP_DASHBOARD_REQUEST,
  FETCH_WHATSAPP_INSIGHTS_REQUEST,
  FETCH_WHATSAPP_MESSAGES_REQUEST,
} from "../actionTypes/whatsappDashboardActionTypes";
import {
  fetchWhatsAppCampaignSaga,
  fetchWhatsAppMessagesSaga,
  whatsappDashboardSaga,
} from "./whatsappDashboardSaga";
import {
  getAdvanceFeatureSaga,
  getUserAllSessionLiveSaga,
  getUserAllSessionSaga,
} from "./conversationSagas";
import {
  ADVANCE_FEATURE,
  USER_ALL_SESSION,
  USER_ALL_SESSION_LIVE,
} from "../actionTypes/conversationActionsTypes";
import { FETCH_SHOPIFY_DASHBOARD_REQUEST } from "../actionTypes/reportActionTypes";
import { fetchShopifyDashboardSaga } from "./reportSagas";
import { CREATE_USER, DELETE_USER, EDIT_USER, GET_USERS } from "../actionTypes/userActionTypes";
import { createUserSaga,editUserSaga, deleteUserSaga, getUsersSaga } from "./usersSagas";
import { GET_SUBSCRIPTION_DATA } from "../actionTypes/subscriptionActionTypes";
import { getSubscriptionSaga } from "./subscriptionSaga";

export default function* rootSaga() {
  yield takeEvery(CREATE_BOT, createBotSaga);
  yield takeEvery(EDIT_BOT, editBotSaga);
  yield takeEvery(GET_BOTS, getBotsSaga);
  yield takeEvery(DELETE_BOT, deleteBotSaga);
  yield takeEvery(EXPORT_BOT_PROFILE, exportBotProfileSaga);
  yield takeEvery(CREATE_WHATSAPP_CAMPAIGN, createWhatsAppCampaignSaga);
  yield takeEvery(FETCH_WHATSAPP_CAMPAIGNS, fetchWhatsappCampaignsSaga);
  yield takeEvery(FETCH_WHATSAPP_TEMPLATES, fetchWhatsAppTemplatesSaga);
  yield takeEvery(CREATE_WHATSAPP_TEMPLATE, createWhatsAppTemplateSaga);
  yield takeEvery(SAVE_WHATSAPPINT, saveWhatsappSaga);
  yield takeEvery(UPDATE_WHATSAPP_REQUEST, updateWhatsappSaga);
  yield takeEvery(GET_WHATSAPP_REQUEST, getWhatsappSaga);
  yield takeEvery(DELETE_WHATSAPP_REQUEST, deleteWhatsappSaga);
  yield takeEvery(FETCH_WHATSAPP_DASHBOARD_REQUEST, whatsappDashboardSaga);
  yield takeEvery(FETCH_WHATSAPP_MESSAGES_REQUEST, fetchWhatsAppMessagesSaga);
  yield takeEvery(FETCH_WHATSAPP_INSIGHTS_REQUEST, fetchWhatsAppCampaignSaga);
  yield takeEvery(TEST_BOT, testBotSaga);
  yield takeEvery(USER_ALL_SESSION, getUserAllSessionSaga);
  yield takeEvery(USER_ALL_SESSION_LIVE, getUserAllSessionLiveSaga);
  yield takeEvery(ADVANCE_FEATURE, getAdvanceFeatureSaga);
  yield takeEvery(FETCH_SHOPIFY_DASHBOARD_REQUEST, fetchShopifyDashboardSaga);
  yield takeEvery(GET_USERS, getUsersSaga);
  yield takeEvery(CREATE_USER, createUserSaga)
  yield takeEvery(EDIT_USER, editUserSaga)
  yield takeEvery(DELETE_USER, deleteUserSaga);
  yield takeEvery(GET_SUBSCRIPTION_DATA, getSubscriptionSaga);
}
