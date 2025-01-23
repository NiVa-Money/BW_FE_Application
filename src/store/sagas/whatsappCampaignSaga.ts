/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put } from "redux-saga/effects";

import { createWhatsAppCampaignService } from "../../api/services/whatsappCampaignService";
import { notifyError } from "../../components/Toast";
import {
  CREATE_WHATSAPP_CAMPAIGN_SUCCESS,
  CREATE_WHATSAPP_CAMPAIGN_FAILURE,
} from "../actionTypes/whatsappCampaignTypes";

export function* createWhatsAppCampaignSaga({
  type,
  payload,
}: {
  type: string;
  payload: any;
}): Generator<any> {
  try {
    const campaignResponse = yield call(createWhatsAppCampaignService, payload);
    yield put({
      type: CREATE_WHATSAPP_CAMPAIGN_SUCCESS,
      payload: campaignResponse,
    });
  } catch (error: any) {
    yield put({
      type: CREATE_WHATSAPP_CAMPAIGN_FAILURE,
      payload: error.message || "An error occurred",
    });

    notifyError("Error creating WhatsApp campaign: Something went wrong");
  }
}
