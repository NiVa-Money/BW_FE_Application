/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  UPDATE_WHATSAPP_REQUEST,
  DELETE_WHATSAPP_REQUEST,
  UPDATE_WHATSAPP_SUCCESS,
  DELETE_WHATSAPP_SUCCESS,
  UPDATE_WHATSAPP_FAILURE,
  DELETE_WHATSAPP_FAILURE,
  GET_WHATSAPP_FAILURE,
  GET_WHATSAPP_REQUEST,
  GET_WHATSAPP_SUCCESS,
} from "../actionTypes/integrationActionTypes";
import { initialState } from "../initialState";

export const integrationReducer = (
  state = initialState.integration.whatsappIntegration,
  action: any
) => {
  switch (action.type) {
    case "SAVE_WHATSAPPINT_SUCCESS":
      return {
        ...state,
        secretToken: action.payload.secretToken,
        webhookUrl: action.payload.webhookUrl,
        error: null,
      };

    case "SAVE_WHATSAPPINT_FAILURE":
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

interface WhatsappState {
  loading: boolean;
  error: string | null;
  data: any | null;
}

export const whatsappcrudReducer = (
  state = initialState.integration,
  action: any
): WhatsappState => {
  switch (action.type) {
    case UPDATE_WHATSAPP_REQUEST:
    case DELETE_WHATSAPP_REQUEST:
      return { ...state, loading: true, error: null };

    case UPDATE_WHATSAPP_SUCCESS:
      return { ...state, loading: false, data: action.payload };

    case DELETE_WHATSAPP_SUCCESS:
      return { ...state, loading: false, data: null };

    case UPDATE_WHATSAPP_FAILURE:
    case DELETE_WHATSAPP_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case GET_WHATSAPP_REQUEST:
      return {
        ...state,
        crudIntegration: {
        loading: true, // Set loading to true during the request
        error: null, // Clear any previous errors
        },
      };

    case GET_WHATSAPP_SUCCESS:
      return {
        ...state,
        crudIntegration: {
          loading: false, // Set loading to false after success
          error: null, // Clear any errors
          data: action.payload, // Update the data with the API response
        },
      };

    case GET_WHATSAPP_FAILURE:
      return {
        ...state,
        crudIntegration: {
        loading: false, // Set loading to false after failure
        data: null, // Clear any data
        error: action.payload, // Set the error message
        },
      };

    default:
      return state;
  }
};
