import {
  CREATE_PAYMENT_REQUEST,
  DB_ENTRY_SUBSCRIPTION,
  GET_SUBSCRIPTION_DATA,
  RESET_SPECIFIC_STATE,
} from "../actionTypes/subscriptionActionTypes";

export const getSubscriptionAction = () => ({
  type: GET_SUBSCRIPTION_DATA,
});
export const createPaymentRequestAction = (payload: {
  planId: string;
  data: any;
}) => ({
  type: CREATE_PAYMENT_REQUEST,
  payload,
});
export const DBEntrySubscriptionAction = (response: any) => ({
  type: DB_ENTRY_SUBSCRIPTION,
  payload: response,
});
export const resetCreateSubscriptionAction = (state: any) => ({
  type: RESET_SPECIFIC_STATE,
  state,
});
