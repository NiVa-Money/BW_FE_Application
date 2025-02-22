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
<<<<<<< HEAD
  state = initialState.whatsappIntegration,
=======
  state = initialState.integration.whatsappIntegration,
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
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

<<<<<<< HEAD
interface WhatsappState {
  loading: boolean;
  error: string | null;
  data: any | null;
}

export const whatsappcrudReducer = (
  state = initialState.crudIntegration,
  action: any
): WhatsappState => {
=======
// interface WhatsappState {
//   loading: boolean;

//   data: any | null;
// }

export const whatsappcrudReducer = (
  state = initialState.integration,
  action: any
): any => {
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
  switch (action.type) {
    case UPDATE_WHATSAPP_REQUEST:
    case DELETE_WHATSAPP_REQUEST:
      return { ...state, loading: true, error: null };
<<<<<<< HEAD
    case UPDATE_WHATSAPP_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case DELETE_WHATSAPP_SUCCESS:
      return { ...state, loading: false, data: null };
    case UPDATE_WHATSAPP_FAILURE:
    case DELETE_WHATSAPP_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case GET_WHATSAPP_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_WHATSAPP_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case GET_WHATSAPP_FAILURE:
      return { ...state, loading: false, error: action.payload };
=======

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
        },
      };

    case GET_WHATSAPP_SUCCESS:
      return {
        ...state,
        crudIntegration: {
          loading: false, // Set loading to false after success
          // Clear any errors
          data: action.payload.data,
        },
      };

    case GET_WHATSAPP_FAILURE:
      return {
        ...state,
        crudIntegration: {
          loading: false, // Set loading to false after failure
          data: null, // Clear any data
        },
      };

>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
    default:
      return state;
  }
};
