/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CREATE_WHATSAPP_CAMPAIGN,
  CREATE_WHATSAPP_CAMPAIGN_SUCCESS,
  CREATE_WHATSAPP_CAMPAIGN_FAILURE,
  CREATE_WHATSAPP_TEMPLATE,
  CREATE_WHATSAPP_TEMPLATE_FAILURE,
  CREATE_WHATSAPP_TEMPLATE_SUCCESS,
  FETCH_WHATSAPP_TEMPLATES,
  FETCH_WHATSAPP_TEMPLATES_FAILURE,
  FETCH_WHATSAPP_TEMPLATES_SUCCESS,
  FETCH_WHATSAPP_CAMPAIGNS,
  FETCH_WHATSAPP_CAMPAIGNS_FAILURE,
  FETCH_WHATSAPP_CAMPAIGNS_SUCCESS,
} from "../actionTypes/whatsappCampaignTypes";
import { initialState } from "../initialState";

export default function whatsappCampaignReducer(
  state = initialState.whatsappCampaign,
  action: any
) {
  switch (action.type) {
    case CREATE_WHATSAPP_CAMPAIGN:
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
      };
    case CREATE_WHATSAPP_CAMPAIGN_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        campaignData: action.payload,
        error: null,
      };
    case CREATE_WHATSAPP_CAMPAIGN_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };
      case FETCH_WHATSAPP_CAMPAIGNS: 
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_WHATSAPP_CAMPAIGNS_SUCCESS:
      return {
        ...state,
        loading: false,
        campaigns: action.payload,
      };
    case FETCH_WHATSAPP_CAMPAIGNS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
}

export function whatsappTemplateReducer(
  state = initialState.whatsappTemplates,
  action: { type: any; payload: any; }
) {
  switch (action.type) {
    case FETCH_WHATSAPP_TEMPLATES:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_WHATSAPP_TEMPLATES_SUCCESS:
      return {
        ...state,
        loading: false,
        templates: action.payload,
      };
    case FETCH_WHATSAPP_TEMPLATES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CREATE_WHATSAPP_TEMPLATE:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_WHATSAPP_TEMPLATE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
      };
    case CREATE_WHATSAPP_TEMPLATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
