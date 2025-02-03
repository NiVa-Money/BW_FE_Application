/* eslint-disable @typescript-eslint/no-explicit-any */
import { FETCH_WHATSAPP_DASHBOARD_REQUEST, FETCH_WHATSAPP_DASHBOARD_SUCCESS, FETCH_WHATSAPP_DASHBOARD_FAILURE } from "../actionTypes/whatsappDashboardActionTypes";
import { initialState } from "../initialState";

export const whatsappDashboardReducer = (state = initialState.whatsappDashboard, action: { type: any; payload: any; }) => {
    switch (action.type) {
      case FETCH_WHATSAPP_DASHBOARD_REQUEST:
        return { ...state, loading: true, error: null };
      case FETCH_WHATSAPP_DASHBOARD_SUCCESS:
        return { ...state, loading: false, data: action.payload };
      case FETCH_WHATSAPP_DASHBOARD_FAILURE:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };