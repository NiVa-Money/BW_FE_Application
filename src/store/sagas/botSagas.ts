import { call, put } from "redux-saga/effects";
import { CREATE_BOT_FAILURE, CREATE_BOT_SUCCESS } from "../actionTypes/botActionsTypes";
import { createBotProfileService } from "../../api/services/botService";
import { notifyError } from "../../components/Toast";

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
  
      notifyError('Error editing Something went wrong');
    }
  }