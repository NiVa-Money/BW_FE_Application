/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CREATE_PAYMENT_REQUEST,
  CREATE_PAYMENT_REQUEST_FAILURE,
  CREATE_PAYMENT_REQUEST_SUCCESS,
  GET_SUBSCRIPTION_DATA,
  GET_SUBSCRIPTION_DATA_FAILURE,
  GET_SUBSCRIPTION_DATA_SUCCESS,
  RESET_SPECIFIC_STATE,
} from "../actionTypes/subscriptionActionTypes";
import { initialState } from "../initialState";
export default function SubscriptionReducer(
  state = initialState.subscription,
  action: any
) {
  switch (action.type) {
    case GET_SUBSCRIPTION_DATA:
      return {
        ...state,
        plans: {
          ...state.test,
          loader: true,
        },
      };
    case GET_SUBSCRIPTION_DATA_SUCCESS:
      return {
        ...state,
        plans: { data: action.payload, loader: false },
      };
    case GET_SUBSCRIPTION_DATA_FAILURE:
      return {
        ...state,
        plans: { data: action.payload, loader: false },
      };

    case CREATE_PAYMENT_REQUEST:
      return {
        ...state,
        create: {
          ...state.create,
          loader: true,
        },
      };
    case CREATE_PAYMENT_REQUEST_SUCCESS:
      console.log("action.payload", action.payload);
      return {
        ...state,
        create: { data: action.payload, loader: false },
      };
    case CREATE_PAYMENT_REQUEST_FAILURE:
      return {
        ...state,
        create: { data: action.payload, loader: false },
      };

    case RESET_SPECIFIC_STATE:
      return {
        ...state,
        [action.state]: { data: null, loader: false }, // Reset to initial state
      };
    default:
      return state;
  }
}
