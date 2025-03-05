/* eslint-disable @typescript-eslint/no-explicit-any */

import { put, call } from "redux-saga/effects";
import {
  DELETE_USER_FAILURE,
  DELETE_USER_SUCCESS,
  GET_USERS_FAILURE,
  GET_USERS_SUCCESS,
} from "../actionTypes/userActionTypes";
import {
  getDeleteUserService,
  getUsersService,
} from "../../api/services/userServices";

export function* getUsersSaga({}: { type: string }): Generator<any> {
  try {
    const userChat = yield call(getUsersService);
    yield put({
      type: GET_USERS_SUCCESS,
      payload: userChat,
    });
  } catch {
    yield put({
      type: GET_USERS_FAILURE,
    });
  }
}

export function* deleteUserSaga({
  payload,
}: {
  type: string;
  payload: any;
}): Generator<any> {
  try {
    const deleteUserSuccess = yield call(getDeleteUserService, payload);
    yield put({
      type: DELETE_USER_SUCCESS,
      payload: deleteUserSuccess,
    });
  } catch {
    yield put({
      type: DELETE_USER_FAILURE,
    });
  }
}
