import { takeEvery, takeLatest } from "redux-saga/effects";
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
  fetchWhatsAppTemplatesSaga,
} from "./whatsappCampaignSaga";
import { FETCH_WHATSAPP_DASHBOARD_REQUEST } from "../actionTypes/whatsappDashboardActionTypes";
import { whatsappDashboardSaga } from "./whatsappDashboard";
import { USER_ALL_SESSION } from "../actionTypes/conversationActionsTypes";
import { getUserAllSessionSaga } from "./conversationSagas";

export default function* rootSaga() {
  yield takeEvery(CREATE_BOT, createBotSaga);
  yield takeEvery(EDIT_BOT, editBotSaga);
  yield takeEvery(GET_BOTS, getBotsSaga);
  yield takeEvery(DELETE_BOT, deleteBotSaga);
  yield takeEvery(EXPORT_BOT_PROFILE, exportBotProfileSaga);
  yield takeEvery(CREATE_WHATSAPP_CAMPAIGN, createWhatsAppCampaignSaga);
  yield takeEvery(FETCH_WHATSAPP_TEMPLATES, fetchWhatsAppTemplatesSaga);
  yield takeEvery(CREATE_WHATSAPP_TEMPLATE, createWhatsAppTemplateSaga);
  yield takeEvery(SAVE_WHATSAPPINT, saveWhatsappSaga);
  yield takeEvery(UPDATE_WHATSAPP_REQUEST, updateWhatsappSaga);
  yield takeEvery(GET_WHATSAPP_REQUEST, getWhatsappSaga);
  yield takeEvery(DELETE_WHATSAPP_REQUEST, deleteWhatsappSaga);
  yield takeLatest(FETCH_WHATSAPP_DASHBOARD_REQUEST, whatsappDashboardSaga);
  yield takeEvery(TEST_BOT, testBotSaga);
  yield takeEvery(USER_ALL_SESSION, getUserAllSessionSaga);
}
