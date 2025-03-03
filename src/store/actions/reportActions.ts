/* eslint-disable @typescript-eslint/no-explicit-any */
import { FETCH_SHOPIFY_DASHBOARD_REQUEST } from "../actionTypes/reportActionTypes";

export const fetchShopifyDashboardRequest = (startDate: string, endDate: string) => ({
    type: FETCH_SHOPIFY_DASHBOARD_REQUEST,
    payload: { startDate, endDate },
  });
  