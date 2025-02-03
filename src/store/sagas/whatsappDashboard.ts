/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put } from 'redux-saga/effects';
import { whatsAppDashboardService } from '../../api/services/whatsappDashboardService';
import { FETCH_WHATSAPP_DASHBOARD_SUCCESS, FETCH_WHATSAPP_DASHBOARD_FAILURE } from '../actionTypes/whatsappDashboardActionTypes';


export function* whatsappDashboardSaga({ payload }: { type: string; payload: any }): Generator<any> {
  try {
    const dashboardData = yield call(whatsAppDashboardService, payload);
    console.log('whatsapp dashbord data',dashboardData);
    yield put({
      type: FETCH_WHATSAPP_DASHBOARD_SUCCESS,
      payload: dashboardData,
    });
  } catch (error: any) {
    console.error('Error in whatsappDashboardSaga:', error);
    yield put({
      type: FETCH_WHATSAPP_DASHBOARD_FAILURE,
      payload: error.message,
    });
  }
}


