
/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put } from "redux-saga/effects";
import {
  CREATE_BOT_FAILURE,
  CREATE_BOT_SUCCESS,
  DELETE_BOT_FAILURE,
  DELETE_BOT_SUCCESS,
  EDIT_BOT_FAILURE,
  EDIT_BOT_SUCCESS,
  EXPORT_BOT_PROFILE_FAILURE,
  EXPORT_BOT_PROFILE_SUCCESS,
  GET_BOTS_FAILURE,
  GET_BOTS_SUCCESS,
  TEST_BOT_FAILURE,
  TEST_BOT_SUCCESS,
} from "../actionTypes/botActionsTypes";
import {
  botTestService,
  createBotProfileService,
  deleteBotService,
  editBotProfileService,
  exportBotProfileService,
  getBotsService,
} from "../../api/services/botService";

export function* createBotSaga({
  payload,
}: {
  type: string;
  payload: any;
}): Generator<any> {
  try {
    const createBotSuccess = yield call(createBotProfileService, payload);
    yield put({
      type: CREATE_BOT_SUCCESS,
      payload: createBotSuccess,
    });
  } catch (error: any) {
    yield put({
      type: CREATE_BOT_FAILURE,
      payload: false,
    });
  }
}
export function* editBotSaga({
  payload,
}: {
  type: string;
  payload: any;
}): Generator<any> {
  try {
    const createBotSuccess = yield call(editBotProfileService, payload);
    yield put({
      type: EDIT_BOT_SUCCESS,
      payload: createBotSuccess,
    });
  } catch (error: any) {
    yield put({
      type: EDIT_BOT_FAILURE,
      payload: false,
    });
  }
}
export function* deleteBotSaga({
  payload,
}: {
  type: string;
  payload: any;
}): Generator<any> {
  try {
    const deleteBotSuccess = yield call(deleteBotService, payload);
    yield put({
      type: DELETE_BOT_SUCCESS,
      payload: deleteBotSuccess,
    });
    try {
      const userId = localStorage.getItem("user_id");
      const getBotsSuccess = yield call(getBotsService, userId);
      yield put({
        type: GET_BOTS_SUCCESS,
        payload: getBotsSuccess,
      });
    } catch (error: any) {
      yield put({
        type: GET_BOTS_FAILURE,
        payload: error.message,
      });
    }
  } catch (error: any) {
    yield put({
      type: DELETE_BOT_FAILURE,
      payload: false,
    });
  }
}

export function* getBotsSaga({
  payload,
}: {
  type: string;
  payload: any;
}): Generator<any> {
  try {
    const getBotsSuccess = yield call(getBotsService, payload);
    yield put({
      type: GET_BOTS_SUCCESS,
      payload: getBotsSuccess,
    });
  } catch (error: any) {
    yield put({
      type: GET_BOTS_FAILURE,
      payload: error.message,
    });
  }
}
export function* exportBotProfileSaga({
  payload,
}: {
  type: string;
  payload: any;
}): Generator<any> {
  try {
    const exportedBotProfile = yield call(exportBotProfileService, payload);
    yield put({
      type: EXPORT_BOT_PROFILE_SUCCESS,
      payload: exportedBotProfile,
    });
  } catch (error: any) {
    yield put({
      type: EXPORT_BOT_PROFILE_FAILURE,
      payload: error.message,
    });
  }
}
export function* testBotSaga({
  payload,
}: {
  type: string;
  payload: any;
}): Generator<any> {
  try {
    const testBotResponse = yield call(botTestService, payload);
    yield put({
      type: TEST_BOT_SUCCESS,
      payload: testBotResponse,
    });
  } catch (error: any) {
    yield put({
      type: TEST_BOT_FAILURE,
      payload: error.message,
    });
  }
}
