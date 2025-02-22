import { FETCH_SHOPIFY_DASHBOARD_REQUEST, FETCH_SHOPIFY_DASHBOARD_SUCCESS, FETCH_SHOPIFY_DASHBOARD_FAILURE } from "../actionTypes/reportActionTypes";
import { initialState } from "../initialState";

export const shopifyDashboardReducer = (state = initialState.shopifyDashboard, action) => {
    switch (action.type) {
      case FETCH_SHOPIFY_DASHBOARD_REQUEST:
        return { ...state, loading: true, error: null };
      case FETCH_SHOPIFY_DASHBOARD_SUCCESS:
        return { ...state, loading: false, shopifyDashboard: action.payload };
      case FETCH_SHOPIFY_DASHBOARD_FAILURE:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };