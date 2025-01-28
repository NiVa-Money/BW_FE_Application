import { takeEvery } from "redux-saga/effects";
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

export default function* rootSaga() {
  yield takeEvery(CREATE_BOT, createBotSaga);
  yield takeEvery(EDIT_BOT, editBotSaga);
  yield takeEvery(GET_BOTS, getBotsSaga);
  yield takeEvery(DELETE_BOT, deleteBotSaga);
  yield takeEvery(CREATE_WHATSAPP_CAMPAIGN, createWhatsAppCampaignSaga);
  yield takeEvery(SAVE_WHATSAPPINT, saveWhatsappSaga); // This listens to SAVE_WHATSAPPINT actions
  yield takeEvery(UPDATE_WHATSAPP_REQUEST, updateWhatsappSaga);
  yield takeEvery(DELETE_WHATSAPP_REQUEST, deleteWhatsappSaga);
}
