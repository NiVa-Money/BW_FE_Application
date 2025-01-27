/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put } from 'redux-saga/effects';
import { deleteWhatsappService, fetchWhatsappData, saveWhatsappService, updateWhatsappService } from '../../api/services/integrationServices';
import { saveWhatsappSuccess, saveWhatsappFailure, deleteWhatsappFailure, deleteWhatsappSuccess, updateWhatsappFailure, updateWhatsappSuccess, getWhatsappFailure, getWhatsappSuccess } from '../actions/integrationActions';


import { SagaIterator } from 'redux-saga';

export function* saveWhatsappSaga(action: { payload: any }): SagaIterator {
  try {
    const response = yield call(saveWhatsappService, action.payload);

    // Extracting secretToken and webhookUrl from response
    const { secretToken, webhookUrl } = response;

    // Dispatching success action with the extracted data
    yield put(saveWhatsappSuccess({ secretToken, webhookUrl }));
  } catch (error) {
    if (error instanceof Error) {
      yield put(saveWhatsappFailure(error.message));
    } else {
      yield put(saveWhatsappFailure('An unknown error occurred'));
    }
  }
}

export function* updateWhatsappSaga(action: any): SagaIterator {
  try {
    const response = yield call(updateWhatsappService, action.payload);  // Call the service
    yield put(updateWhatsappSuccess(response.data));  // Dispatch success action
  } catch (error) {
    if (error instanceof Error) {
      if ((error as any).isAxiosError && (error as any).response) {
        yield put(updateWhatsappFailure((error as any).response.data));  // Dispatch failure action
      } else {
        yield put(updateWhatsappFailure(error.message));  // Dispatch failure action
      }
    } else {
      yield put(updateWhatsappFailure('An unknown error occurred'));  // Dispatch failure action
    }
  }
}

export function* deleteWhatsappSaga(action: any): SagaIterator {
  try {
    const response = yield call(deleteWhatsappService, action.payload.id);  // Call the service
    yield put(deleteWhatsappSuccess(response.data));  // Dispatch success action
  } catch (error) {
    if (error instanceof Error) {
      yield put(deleteWhatsappFailure((error as any).response ? (error as any).response.data : error.message));  // Dispatch failure action
    } else {
      yield put(deleteWhatsappFailure('An unknown error occurred'));  // Dispatch failure action
    }
  }
}


export function* getWhatsappSaga(action: { payload: string }): any {
  try {
    const response = yield call(fetchWhatsappData, action.payload);
    yield put(getWhatsappSuccess(response));
  } catch (error) {
    if (error instanceof Error) {
      yield put(getWhatsappFailure(error.message));
    } else {
      yield put(getWhatsappFailure("An unknown error occurred"));
    }
  }
}



