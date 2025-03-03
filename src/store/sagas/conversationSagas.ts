/* eslint-disable @typescript-eslint/no-explicit-any */

import { put, call } from "redux-saga/effects";
import {
  getAdvanceFeatureService,
  getUserAllSessionLiveService,
  getUserAllSessionService,
} from "../../api/services/conversationServices";
import {
  USER_All_SESSION_SUCCESS,
  USER_All_SESSION_FAILURE,
  ADVANCE_FEATURE_FAILURE,
  ADVANCE_FEATURE_SUCCESS,
  GET_USER_All_SESSION_FAILURE_LIVE,
  GET_USER_All_SESSION_SUCCESS_LIVE,
} from "../actionTypes/conversationActionsTypes";

export function* getUserAllSessionSaga({
  payload,
}: {
  type: string;
  payload: any;
}): Generator<any> {
  try {
    const userChat = yield call(getUserAllSessionService, payload);
    yield put({
      type: USER_All_SESSION_SUCCESS,
      payload: userChat,
    });
  } catch {
    yield put({
      type: USER_All_SESSION_FAILURE,
    });
  }
}

export function* getUserAllSessionLiveSaga({
  payload,
}: {
  type: string;
  payload: any;
}): Generator<any> {
  try {
    const userChat = yield call(getUserAllSessionLiveService, payload);
    yield put({
      type: GET_USER_All_SESSION_SUCCESS_LIVE,
      payload: userChat,
    });
  } catch {
    yield put({
      type: GET_USER_All_SESSION_FAILURE_LIVE,
    });
  }
}

export function* getAdvanceFeatureSaga({
  payload,
}: {
  type: string;
  payload: any;
}): Generator<any> {
  try {
    const {
      sessionId,
      userPhoneNumberId,
      adminPhoneNumberId,
      channelName,
      botId,
    } = payload;

    const data = {
      sessionId,
      userPhoneNumberId,
      adminPhoneNumberId,
      channelName,
      botId,
    };
    const userChat = yield call(getAdvanceFeatureService, data);
    yield put({
      type: ADVANCE_FEATURE_SUCCESS,
      payload: userChat,
    });
  } catch (error: any) {
    console.log(error);
    yield put({
      type: ADVANCE_FEATURE_FAILURE,
    });
  }
}
