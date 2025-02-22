<<<<<<< HEAD
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put } from "redux-saga/effects";

import { createWhatsAppCampaignService, createWhatsAppTemplateService, fetchWhatsAppTemplatesService } from "../../api/services/whatsappCampaignService";
=======
/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put } from "redux-saga/effects";

import {
  createWhatsAppCampaignService,
  createWhatsAppTemplateService,
  fetchCampaignService,
  fetchWhatsAppTemplatesService,
} from "../../api/services/whatsappCampaignService";
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
import { notifyError } from "../../components/Toast";
import {
  CREATE_WHATSAPP_CAMPAIGN_SUCCESS,
  CREATE_WHATSAPP_CAMPAIGN_FAILURE,
  CREATE_WHATSAPP_TEMPLATE_FAILURE,
  CREATE_WHATSAPP_TEMPLATE_SUCCESS,
  FETCH_WHATSAPP_TEMPLATES_FAILURE,
  FETCH_WHATSAPP_TEMPLATES_SUCCESS,
<<<<<<< HEAD
=======
  FETCH_WHATSAPP_CAMPAIGNS_SUCCESS,
  FETCH_WHATSAPP_CAMPAIGNS_FAILURE,
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
} from "../actionTypes/whatsappCampaignTypes";
import axios from "axios";

export function* createWhatsAppCampaignSaga({
<<<<<<< HEAD
  type,
=======
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
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
<<<<<<< HEAD
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
=======
   console.log('campaignid' , campaignId)

    yield put({
      type: CREATE_WHATSAPP_CAMPAIGN_SUCCESS,
      payload: campaignResponse.data, // Sending full response
    });
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
  } catch (error: any) {
    // Handle error
    if (axios.isAxiosError(error)) {
      console.error(
        "Error creating WhatsApp campaign:",
        error.response?.data || error.message
      );
<<<<<<< HEAD
    } else {
      console.error("Unexpected error:", error);
=======
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
    }

    // Dispatch failure action
    yield put({
      type: CREATE_WHATSAPP_CAMPAIGN_FAILURE,
      payload: error.message || "An error occurred",
    });
<<<<<<< HEAD

    // Notify the user
    notifyError(
      error.response?.data?.message || "Error creating WhatsApp campaign: Something went wrong"
    );
  }
}


export function* fetchWhatsAppTemplatesSaga({ payload }: { payload: any }): Generator<any, void, any> {
  try {
    const response = yield call(fetchWhatsAppTemplatesService, payload);
=======
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
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
    yield put({
      type: FETCH_WHATSAPP_TEMPLATES_SUCCESS,
      payload: response,
    });
  } catch (error) {
    yield put({
      type: FETCH_WHATSAPP_TEMPLATES_FAILURE,
<<<<<<< HEAD
      payload: (error as Error).message || 'Failed to fetch templates.',
    });
    notifyError('Failed to fetch WhatsApp templates.');
  }
}

export function* createWhatsAppTemplateSaga({ payload }: { payload: any }) {
  try {
    yield call(createWhatsAppTemplateService, payload);
=======
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
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
    yield put({
      type: CREATE_WHATSAPP_TEMPLATE_SUCCESS,
    });
  } catch (error) {
    yield put({
      type: CREATE_WHATSAPP_TEMPLATE_FAILURE,
<<<<<<< HEAD
      payload: (error as Error).message || 'Failed to create template.',
    });
    notifyError('Failed to create WhatsApp template.');
=======
      payload: (error as Error).message || "Failed to create template.",
    });
    notifyError("Failed to create WhatsApp template.");
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
  }
}
