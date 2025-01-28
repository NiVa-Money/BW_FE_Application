import { takeEvery, takeLatest } from "redux-saga/effects";
import {
  CREATE_BOT,
  DELETE_BOT,
  EDIT_BOT,
  GET_BOTS,
} from "../actionTypes/botActionsTypes";
import {
  createBotSaga,
  deleteBotSaga,
  editBotSaga,
  getBotsSaga,
} from "./botSagas";
import { CREATE_WHATSAPP_CAMPAIGN } from '../actionTypes/whatsappCampaignTypes';
import { createWhatsAppCampaignSaga } from './whatsappCampaignSaga';
import { deleteWhatsappSaga, saveWhatsappSaga, updateWhatsappSaga } from './integrationSaga';
import { DELETE_WHATSAPP_REQUEST, SAVE_WHATSAPPINT, UPDATE_WHATSAPP_REQUEST } from '../actionTypes/integrationActionTypes';

export default function* rootSaga() {
  yield takeEvery(CREATE_BOT, createBotSaga);
    yield takeLatest(CREATE_WHATSAPP_CAMPAIGN, createWhatsAppCampaignSaga);
    yield takeEvery(SAVE_WHATSAPPINT, saveWhatsappSaga); // This listens to SAVE_WHATSAPPINT actions
    yield takeEvery(UPDATE_WHATSAPP_REQUEST, updateWhatsappSaga);
    yield takeEvery(DELETE_WHATSAPP_REQUEST, deleteWhatsappSaga);  yield takeEvery(EDIT_BOT, editBotSaga);
  yield takeEvery(GET_BOTS, getBotsSaga);
  yield takeEvery(DELETE_BOT, deleteBotSaga);
}
