/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put } from "redux-saga/effects";
import {
  whatsAppDashboardMessagesService,
  whatsAppDashboardService,
} from "../../api/services/whatsappDashboardService";
import {
  FETCH_WHATSAPP_DASHBOARD_SUCCESS,
  FETCH_WHATSAPP_DASHBOARD_FAILURE,
  FETCH_WHATSAPP_MESSAGES_FAILURE,
  FETCH_WHATSAPP_MESSAGES_SUCCESS,
} from "../actionTypes/whatsappDashboardActionTypes";

export function* whatsappDashboardSaga({
  payload,
}: {
  type: string;
  payload: any;
}): Generator<any> {
  try {
    const dashboardData = yield call(whatsAppDashboardService, payload);
    console.log("whatsapp dashbord data", dashboardData);
    yield put({
      type: FETCH_WHATSAPP_DASHBOARD_SUCCESS,
      payload: dashboardData,
    });
  } catch (error: any) {
    console.error("Error in whatsappDashboardSaga:", error);
    yield put({
      type: FETCH_WHATSAPP_DASHBOARD_FAILURE,
      payload: error.message,
    });
  }
}

export function* fetchWhatsAppMessagesSaga(
  action: any
): Generator<any, void, any> {
  try {
    const { page, limit, filter } = action.payload; // Extract values from payload
    console.log("Fetching data for:", { page, limit, filter });

    // Pass full payload object to the service function
    const data = yield call(whatsAppDashboardMessagesService, {
      page,
      limit,
      filter,
    });
    console.log("WhatsApp messages data:", data);

    yield put({
      type: FETCH_WHATSAPP_MESSAGES_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    console.error("Error in whatsappDashboardSaga:", error);
    yield put({
      type: FETCH_WHATSAPP_MESSAGES_FAILURE,
      payload: error.message,
    });
  }
}
