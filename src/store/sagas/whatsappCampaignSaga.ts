/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put } from "redux-saga/effects";

import {
  createWhatsAppCampaignService,
  createWhatsAppTemplateService,
  fetchCampaignService,
  fetchWhatsAppTemplatesService,
} from "../../api/services/whatsappCampaignService";
import { notifyError } from "../../components/Toast";
import {
  CREATE_WHATSAPP_CAMPAIGN_SUCCESS,
  CREATE_WHATSAPP_CAMPAIGN_FAILURE,
  CREATE_WHATSAPP_TEMPLATE_FAILURE,
  CREATE_WHATSAPP_TEMPLATE_SUCCESS,
  FETCH_WHATSAPP_TEMPLATES_FAILURE,
  FETCH_WHATSAPP_TEMPLATES_SUCCESS,
  FETCH_WHATSAPP_CAMPAIGNS_SUCCESS,
  FETCH_WHATSAPP_CAMPAIGNS_FAILURE,
} from "../actionTypes/whatsappCampaignTypes";
import axios from "axios";

export function* createWhatsAppCampaignSaga({
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

    yield put({
      type: CREATE_WHATSAPP_CAMPAIGN_SUCCESS,
      payload: campaignResponse.data, // Sending full response
    });
  } catch (error: any) {
    // Handle error
    if (axios.isAxiosError(error)) {
      console.error(
        "Error creating WhatsApp campaign:",
        error.response?.data || error.message
      );
    }

    // Dispatch failure action
    yield put({
      type: CREATE_WHATSAPP_CAMPAIGN_FAILURE,
      payload: error.message || "An error occurred",
    });
  }
}

export function* fetchWhatsappCampaignsSaga(): Generator<any, void, any> {
  try {
    const response = yield call(fetchCampaignService); // Corrected call
    yield put({
      type: FETCH_WHATSAPP_CAMPAIGNS_SUCCESS,
      payload: response,
    });
  } catch (error) {
    yield put({
      type: FETCH_WHATSAPP_CAMPAIGNS_FAILURE,
      payload: (error as Error).message || "Failed to fetch templates.",
    });
    notifyError("Failed to fetch WhatsApp campaigns."); // Updated error message
  }
}

export function* fetchWhatsAppTemplatesSaga(action: {
  type: string;
  payload: any;
}): Generator<any, void, any> {
  try {
    const response = yield call(fetchWhatsAppTemplatesService, action.payload);
    yield put({
      type: FETCH_WHATSAPP_TEMPLATES_SUCCESS,
      payload: response,
    });
  } catch (error) {
    yield put({
      type: FETCH_WHATSAPP_TEMPLATES_FAILURE,
      payload: (error as Error).message || "Failed to fetch templates.",
    });
    notifyError("Failed to fetch WhatsApp templates.");
  }
}

export function* createWhatsAppTemplateSaga(action: {
  type: string;
  payload: any;
}): Generator<any, void, any> {
  try {
    yield call(createWhatsAppTemplateService, action.payload);
    yield put({
      type: CREATE_WHATSAPP_TEMPLATE_SUCCESS,
    });
  } catch (error) {
    yield put({
      type: CREATE_WHATSAPP_TEMPLATE_FAILURE,
      payload: (error as Error).message || "Failed to create template.",
    });
    notifyError("Failed to create WhatsApp template.");
  }
}
