import { takeEvery } from "redux-saga/effects";
import {
  CREATE_BOT,
  DELETE_BOT,
  EDIT_BOT,
  EXPORT_BOT_PROFILE,
  GET_BOTS,
} from "../actionTypes/botActionsTypes";
import {
  createBotSaga,
  deleteBotSaga,
  editBotSaga,
  exportBotProfileSaga,
  getBotsSaga,
} from "./botSagas";

export default function* rootSaga() {
  yield takeEvery(CREATE_BOT, createBotSaga);
  yield takeEvery(EDIT_BOT, editBotSaga);
  yield takeEvery(GET_BOTS, getBotsSaga);
  yield takeEvery(DELETE_BOT, deleteBotSaga);
  yield takeEvery(EXPORT_BOT_PROFILE, exportBotProfileSaga);
}
