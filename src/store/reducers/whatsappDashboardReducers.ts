/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FETCH_WHATSAPP_DASHBOARD_REQUEST,
  FETCH_WHATSAPP_DASHBOARD_SUCCESS,
  FETCH_WHATSAPP_DASHBOARD_FAILURE,
  FETCH_WHATSAPP_MESSAGES_REQUEST,
  FETCH_WHATSAPP_MESSAGES_FAILURE,
  FETCH_WHATSAPP_MESSAGES_SUCCESS,
  FETCH_WHATSAPP_INSIGHTS_FAILURE,
  FETCH_WHATSAPP_INSIGHTS_REQUEST,
  FETCH_WHATSAPP_INSIGHTS_SUCCESS,
} from "../actionTypes/whatsappDashboardActionTypes";
import { initialState } from "../initialState";

export const whatsappDashboardReducer = (
  state = initialState.whatsappDashboard,
  action: { type: any; payload: any }
) => {
  switch (action.type) {
    case FETCH_WHATSAPP_DASHBOARD_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_WHATSAPP_DASHBOARD_SUCCESS:
      return { ...state, loading: false, dashboardData: action.payload };
    case FETCH_WHATSAPP_DASHBOARD_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case FETCH_WHATSAPP_MESSAGES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_WHATSAPP_MESSAGES_SUCCESS:
      return { ...state, loading: false, messages: action.payload };
    case FETCH_WHATSAPP_MESSAGES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case FETCH_WHATSAPP_INSIGHTS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_WHATSAPP_INSIGHTS_SUCCESS:
      return { ...state, loading: false, campaignInsights: action.payload };

    case FETCH_WHATSAPP_INSIGHTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
