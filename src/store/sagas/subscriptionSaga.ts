/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put } from "redux-saga/effects";
import {
  GET_SUBSCRIPTION_DATA_FAILURE,
  GET_SUBSCRIPTION_DATA_SUCCESS,
} from "../actionTypes/subscriptionActionTypes";
import { getSubscriptionService } from "../../api/services/subscriptionServices";

export function* getSubscriptionSaga(): Generator<any> {
  try {
    const subsResponse = yield call(() => getSubscriptionService());
    yield put({
      type: GET_SUBSCRIPTION_DATA_SUCCESS,
      payload: subsResponse,
    });
  } catch (error: any) {
    yield put({
      type: GET_SUBSCRIPTION_DATA_FAILURE,
      payload: error.message,
    });
  }
}
