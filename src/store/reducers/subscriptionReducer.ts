/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  GET_SUBSCRIPTION_DATA,
  GET_SUBSCRIPTION_DATA_FAILURE,
  GET_SUBSCRIPTION_DATA_SUCCESS,
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
    default:
      return state;
  }
}
