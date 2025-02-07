/* eslint-disable @typescript-eslint/no-explicit-any */

import { put, call } from "redux-saga/effects";
import { getAdvanceFeatureService, getUserAllSessionService } from "../../api/services/conversationServices";
import {
  GET_USER_All_SESSION_SUCCESS,
  GET_USER_All_SESSION_FAILURE,
  ADVANCE_FEATURE_FAILURE,
  ADVANCE_FEATURE_SUCCESS,
} from "../actionTypes/conversationActionsTypes";
import { notifyError } from "../../components/Toast";

export function* getUserAllSessionSaga({
  payload,
}: {
  payload: any;
}): Generator<any> {
  try {
    const userChat = yield call(getUserAllSessionService, payload);
    yield put({
      type: GET_USER_All_SESSION_SUCCESS,
      payload: userChat,
    });
  } catch {
    yield put({
      type: GET_USER_All_SESSION_FAILURE,
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
    const data = {
      sessionId: payload,
    };
    const userChat = yield call(getAdvanceFeatureService, data);
    yield put({
      type: ADVANCE_FEATURE_SUCCESS,
      payload: userChat,
    });
  } catch (error: any) {
    notifyError(`${error}`);
    yield put({
      type: ADVANCE_FEATURE_FAILURE,
    });
  }
}