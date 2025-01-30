/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put } from "redux-saga/effects";
import {
  CREATE_BOT_FAILURE,
  CREATE_BOT_SUCCESS,
  DELETE_BOT_FAILURE,
  DELETE_BOT_SUCCESS,
  EDIT_BOT_FAILURE,
  EDIT_BOT_SUCCESS,
  GET_BOTS_FAILURE,
  GET_BOTS_SUCCESS,
} from "../actionTypes/botActionsTypes";
import {
  createBotProfileService,
  deleteBotService,
  editBotProfileService,
  getBotsService,
} from "../../api/services/botService";

export function* createBotSaga({
  payload,
}: {
  type: string;
  payload: any;
}): Generator<any> {
  console.log("calling create saga");
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
      console.error("Error in getBotsSaga:", error);

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
    console.error("Error in getBotsSaga:", error);

    yield put({
      type: GET_BOTS_FAILURE,
      payload: error.message,
    });
  }
}
