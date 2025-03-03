/* eslint-disable @typescript-eslint/no-explicit-any */

import { call, put } from "redux-saga/effects";
import { fetchShopifyDashboardService } from "../../api/services/reportServices";
import { FETCH_SHOPIFY_DASHBOARD_SUCCESS, FETCH_SHOPIFY_DASHBOARD_FAILURE } from "../actionTypes/reportActionTypes";

export function* fetchShopifyDashboardSaga({ payload }: { type: string; payload: any }): Generator<any> {
    try {
      const data = yield call(fetchShopifyDashboardService, payload.startDate, payload.endDate);
      yield put({
        type: FETCH_SHOPIFY_DASHBOARD_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      yield put({
        type: FETCH_SHOPIFY_DASHBOARD_FAILURE,
        payload: error.message || "Something went wrong",
      });
    }
  }