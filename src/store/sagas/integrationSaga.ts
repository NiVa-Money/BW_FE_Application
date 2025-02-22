/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put } from "redux-saga/effects";
import {
  deleteWhatsappService,
<<<<<<< HEAD
  fetchWhatsappData,
=======
  getWhatsappData,
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
  saveWhatsappService,
  updateWhatsappService,
} from "../../api/services/integrationServices";
import {
  saveWhatsappSuccess,
  saveWhatsappFailure,
  deleteWhatsappFailure,
  deleteWhatsappSuccess,
  updateWhatsappFailure,
  updateWhatsappSuccess,
<<<<<<< HEAD
  getWhatsappFailure,
  getWhatsappSuccess,
} from "../actions/integrationActions";

import { SagaIterator } from "redux-saga";

export function* saveWhatsappSaga(action: { payload: any }): SagaIterator {
  try {
    const response = yield call(saveWhatsappService, action.payload);

    // Extracting secretToken and webhookUrl from response
    const { secretToken, webhookUrl } = response;
=======
  // getWhatsappFailure,
  // getWhatsappSuccess,
} from "../actions/integrationActions";

import { SagaIterator } from "redux-saga";
import {
  GET_WHATSAPP_FAILURE,
  GET_WHATSAPP_SUCCESS,
} from "../actionTypes/integrationActionTypes";

export function* saveWhatsappSaga({
  payload,
}: {
  type: string;
  payload: any;
}): Generator<any> {
  try {
    const response = yield call(saveWhatsappService, payload);

    // Extracting secretToken and webhookUrl from response
    const { secretToken, webhookUrl } = response.data;
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161

    // Dispatching success action with the extracted data
    yield put(saveWhatsappSuccess({ secretToken, webhookUrl }));
  } catch (error) {
    if (error instanceof Error) {
      yield put(saveWhatsappFailure(error.message));
    } else {
      yield put(saveWhatsappFailure("An unknown error occurred"));
    }
  }
}

export function* updateWhatsappSaga(action: any): SagaIterator {
  try {
    const response = yield call(updateWhatsappService, action.payload); // Call the service
    yield put(updateWhatsappSuccess(response.data)); // Dispatch success action
  } catch (error) {
    if (error instanceof Error) {
      if ((error as any).isAxiosError && (error as any).response) {
        yield put(updateWhatsappFailure((error as any).response.data)); // Dispatch failure action
      } else {
        yield put(updateWhatsappFailure(error.message)); // Dispatch failure action
      }
    } else {
      yield put(updateWhatsappFailure("An unknown error occurred")); // Dispatch failure action
    }
  }
}

export function* deleteWhatsappSaga(action: any): SagaIterator {
  try {
    const response = yield call(deleteWhatsappService, action.payload.id); // Call the service
    yield put(deleteWhatsappSuccess(response.data)); // Dispatch success action
  } catch (error) {
    if (error instanceof Error) {
      yield put(
        deleteWhatsappFailure(
          (error as any).response ? (error as any).response.data : error.message
        )
      ); // Dispatch failure action
    } else {
      yield put(deleteWhatsappFailure("An unknown error occurred")); // Dispatch failure action
    }
  }
}

<<<<<<< HEAD
export function* getWhatsappSaga(action: { payload: string }): any {
  try {
    const response = yield call(fetchWhatsappData, action.payload);

    yield put(getWhatsappSuccess(response));
    const integrationId = response.integrationId;
    if (integrationId) {
      console.log("Integration ID: ", integrationId);
      yield put(integrationId);
    }
  } catch (error) {
    if (error instanceof Error) {
      yield put(getWhatsappFailure(error.message));
    } else {
      yield put(getWhatsappFailure("An unknown error occurred"));
    }
=======
export function* getWhatsappSaga({
  payload,
}: {
  type: string;
  payload: any;
}): Generator<any> {
  try {
    const getWhatsappSuc = yield call(getWhatsappData, payload);

    // Dispatch action to save the full response in Redux
    // yield put(getWhatsappSuccess(response.data));
    yield put({
      type: GET_WHATSAPP_SUCCESS,
      payload: getWhatsappSuc,
    });
  } catch (error: any) {
    console.error("Error in getWhatsappSuc:", error);

    yield put({
      type: GET_WHATSAPP_FAILURE,
      payload: error.message,
    });
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
  }
}
