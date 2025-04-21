/* eslint-disable @typescript-eslint/no-explicit-any */

import { put, call } from "redux-saga/effects";
import {
  CREATE_USER_FAILURE,
  CREATE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  DELETE_USER_SUCCESS,
  EDIT_USER_FAILURE,
  EDIT_USER_SUCCESS,
  GET_USERS_FAILURE,
  GET_USERS_SUCCESS,
} from "../actionTypes/userActionTypes";
import {
  createUserService,
  editUserService,
  getDeleteUserService,
  getUsersService,
} from "../../api/services/userServices";

export function* getUsersSaga({}: { type: string }): Generator<any> {
  try {
    const fetchedUsers = yield call(getUsersService);
    yield put({
      type: GET_USERS_SUCCESS,
      payload: fetchedUsers,
    });
  } catch {
    yield put({
      type: GET_USERS_FAILURE,
    });
  }
}

export function* createUserSaga({
  payload,
}: {
  type: string;
  payload: any;
}): Generator<any> {
  try {
    // Step 1: User creation
    const createUserResponse = yield call(createUserService, payload);

    yield put({
      type: CREATE_USER_SUCCESS,
      payload: createUserResponse,
    });

    // Step 2: Refresh users list
    try {
      const fetchedUsers = yield call(getUsersService);
      yield put({
        type: GET_USERS_SUCCESS,
        payload: fetchedUsers,
      });
    } catch (getUsersError) {
      yield put({ type: GET_USERS_FAILURE });
    }
  } catch (createUserError) {
    yield put({ type: CREATE_USER_FAILURE });
  }
}

export function* editUserSaga({
  payload,
}: {
  type: string;
  payload: any;
}): Generator<any> {
  try {
    // Step 1: Edit User
    const editUserResponse = yield call(editUserService, payload);

    yield put({
      type: EDIT_USER_SUCCESS,
      payload: editUserResponse,
    });

    // Step 2: Refresh users list
    try {
      const fetchedUsers = yield call(getUsersService);
      yield put({
        type: GET_USERS_SUCCESS,
        payload: fetchedUsers,
      });
    } catch (getUsersError) {
      yield put({ type: GET_USERS_FAILURE });
    }
  } catch (createUserError) {
    yield put({ type: EDIT_USER_FAILURE });
  }
}

export function* deleteUserSaga({
  payload,
}: {
  type: string;
  payload: any;
}): Generator<any> {
  try {
    // Step 1: Delete User
    const deleteUserSuccess = yield call(getDeleteUserService, payload);
    yield put({
      type: DELETE_USER_SUCCESS,
      payload: deleteUserSuccess,
    });

    // Step 2: Refresh users list
    try {
      const userChat = yield call(getUsersService);
      yield put({
        type: GET_USERS_SUCCESS,
        payload: userChat,
      });
    } catch (getUsersError) {
      yield put({ type: GET_USERS_FAILURE });
    }
  } catch {
    yield put({
      type: DELETE_USER_FAILURE,
    });
  }
}
