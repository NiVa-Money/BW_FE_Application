import { call, put } from "redux-saga/effects";
import { CREATE_BOT_FAILURE, CREATE_BOT_SUCCESS, GET_BOTS_FAILURE, GET_BOTS_SUCCESS } from "../actionTypes/botActionsTypes";
import { createBotProfileService, editBotProfileService, getBotsService } from "../../api/services/botService";

export function* createBotSaga({
    type,
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
    type,
    payload,
  }: {
    type: string;
    payload: any;
  }): Generator<any> {
    try {
      const createBotSuccess = yield call(editBotProfileService, payload);
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
  export function* getBotsSaga({
    type,
    payload,
  }: {
    type: string;
    payload: any;
  }): Generator<any> {
    try {
      console.log('Saga triggered with payload:', payload);
      const getBotsSuccess = yield call(getBotsService, payload);
      console.log('Service response:', getBotsSuccess);
      yield put({
        type: GET_BOTS_SUCCESS,
        payload: getBotsSuccess,
      });
    } catch (error: any) {
      console.error('Error in getBotsSaga:', error);

    yield put({
      type: GET_BOTS_FAILURE,
      payload: error.message,
    });
      // yield put({
      //   type: GET_BOTS_FAILURE,
      //   payload: false,
      // });
  
    }
  }