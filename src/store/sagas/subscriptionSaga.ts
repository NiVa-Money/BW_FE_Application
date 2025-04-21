/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put } from "redux-saga/effects";
import {
  CREATE_PAYMENT_REQUEST_SUCCESS,
  GET_SUBSCRIPTION_DATA_FAILURE,
  GET_SUBSCRIPTION_DATA_SUCCESS,
} from "../actionTypes/subscriptionActionTypes";
import {
  createSubscriptionService,
  getSubscriptionService,
} from "../../api/services/subscriptionServices";
// import { DBEntrySubscriptionAction } from "../actions/subscriptionActions";

export function* getSubscriptionSaga(): Generator<any> {
  try {
    const subsResponse = yield call(() => getSubscriptionService());
    yield put({
      type: GET_SUBSCRIPTION_DATA_SUCCESS,
      payload: subsResponse,
    });
  } catch (error: any) {
    yield put({
      type: GET_SUBSCRIPTION_DATA_FAILURE,
      payload: error.message,
    });
  }
}
export function* createSubscriptionSaga({
  payload,
}: {
  type: string;
  payload: { planId: string; data: any };
}): Generator<any> {
  try {
    const { planId, data } = payload;
    const response: any = yield call(createSubscriptionService, planId, data);
    console.log("PayPal payment creation response:", response);
    const approvalUrl = response?.approvalUrl;
    const subscriptionId = response?._id;
    console.log("PayPal subscriptionId", subscriptionId);
    if (approvalUrl) {
      // Dispatch success action to store approvalUrl
      yield put({
        type: CREATE_PAYMENT_REQUEST_SUCCESS,
        payload: response,
      });
    } else {
      throw new Error("Approval URL not found in the response");
    }
    // notifySuccess("Payment processed successfully");
  } catch (error: any) {
    console.error("Error in payPalPaymentSaga:", error);
    // yield put(createPaymentFailure(error.message));
    // notifyError("Payment processing failed");
  }
}
