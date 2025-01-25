/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put } from "redux-saga/effects";

import { createWhatsAppCampaignService } from "../../api/services/whatsappCampaignService";
import { notifyError } from "../../components/Toast";
import {
  CREATE_WHATSAPP_CAMPAIGN_SUCCESS,
  CREATE_WHATSAPP_CAMPAIGN_FAILURE,
} from "../actionTypes/whatsappCampaignTypes";
import axios from "axios";

export function* createWhatsAppCampaignSaga({
  type,
  payload,
}: {
  type: string;
  payload: any;
}): Generator<any> {
  try {
    // Call the service to create the campaign
    const campaignResponse = yield call(createWhatsAppCampaignService, payload);

    // Extract campaignId from the response data
    const campaignId = campaignResponse?.data?.campaignId;
    console.log('campaignid' , campaignId)

    // Dispatch success action with the campaignId
    if (campaignId) {
      yield put({
        type: CREATE_WHATSAPP_CAMPAIGN_SUCCESS,
        payload: { campaignId }, // Only sending campaignId to the store
      });
    } else {
      // If no campaignId in the response, send a fallback error message
      yield put({
        type: CREATE_WHATSAPP_CAMPAIGN_FAILURE,
        payload: "Campaign created but no campaignId returned.",
      });
      notifyError("Campaign created, but no campaignId returned.");
    }
  } catch (error: any) {
    // Handle error
    if (axios.isAxiosError(error)) {
      console.error(
        "Error creating WhatsApp campaign:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }

    // Dispatch failure action
    yield put({
      type: CREATE_WHATSAPP_CAMPAIGN_FAILURE,
      payload: error.message || "An error occurred",
    });

    // Notify the user
    notifyError(
      error.response?.data?.message || "Error creating WhatsApp campaign: Something went wrong"
    );
  }
}
