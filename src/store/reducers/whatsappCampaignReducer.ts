/* eslint-disable @typescript-eslint/no-explicit-any */

import { CREATE_WHATSAPP_CAMPAIGN, CREATE_WHATSAPP_CAMPAIGN_SUCCESS, CREATE_WHATSAPP_CAMPAIGN_FAILURE } from '../actionTypes/whatsappCampaignTypes';
import { initialState } from '../initialState';

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
        error: null,
      };
    case CREATE_WHATSAPP_CAMPAIGN_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
