/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put } from 'redux-saga/effects';
import { saveWhatsappService } from '../../api/services/integrationServices';
import { saveWhatsappSuccess, saveWhatsappFailure } from '../actions/integrationActions';


import { SagaIterator } from 'redux-saga';

export function* saveWhatsappSaga(action: { payload: any; }): SagaIterator {
  try {
    const response = yield call(saveWhatsappService, action.payload);
    yield put(saveWhatsappSuccess(response));
  } catch (error) {
    if (error instanceof Error) {
      yield put(saveWhatsappFailure(error.message));
    } else {
      yield put(saveWhatsappFailure('An unknown error occurred'));
    }
  }
}


