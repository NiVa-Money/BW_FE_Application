/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SAVE_WHATSAPPINT,
  SAVE_WHATSAPPINT_SUCCESS,
  SAVE_WHATSAPPINT_FAILURE,
  DELETE_WHATSAPP_FAILURE,
  DELETE_WHATSAPP_REQUEST,
  DELETE_WHATSAPP_SUCCESS,
  UPDATE_WHATSAPP_FAILURE,
  UPDATE_WHATSAPP_REQUEST,
  UPDATE_WHATSAPP_SUCCESS,
  GET_WHATSAPP_FAILURE,
  GET_WHATSAPP_REQUEST,
  GET_WHATSAPP_SUCCESS,
} from "../actionTypes/integrationActionTypes";

export const saveWhatsapp = (payload: any) => ({
  type: SAVE_WHATSAPPINT,
  payload,
});

export const saveWhatsappSuccess = (payload: {
  secretToken: string;
  webhookUrl: string;
}) => ({
  type: SAVE_WHATSAPPINT_SUCCESS,
  payload,
});

export const saveWhatsappFailure = (error: string) => ({
  type: SAVE_WHATSAPPINT_FAILURE,
  payload: error,
});

export const updateWhatsappRequest = (data: any) => ({
  type: UPDATE_WHATSAPP_REQUEST,
  payload: data,
});

export const deleteWhatsappRequest = (id: string) => ({
  type: DELETE_WHATSAPP_REQUEST,
  payload: { id },
});

export const updateWhatsappSuccess = (data: any) => ({
  type: UPDATE_WHATSAPP_SUCCESS,
  payload: data,
});

export const updateWhatsappFailure = (error: any) => ({
  type: UPDATE_WHATSAPP_FAILURE,
  payload: error,
});

export const deleteWhatsappSuccess = (data: any) => ({
  type: DELETE_WHATSAPP_SUCCESS,
  payload: data,
});

export const deleteWhatsappFailure = (error: any) => ({
  type: DELETE_WHATSAPP_FAILURE,
  payload: error,
});

<<<<<<< HEAD

=======
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
export const getWhatsappRequest = (botId: string) => ({
  type: GET_WHATSAPP_REQUEST,
  payload: botId,
});

export const getWhatsappSuccess = (data: any) => ({
  type: GET_WHATSAPP_SUCCESS,
  payload: data,
});

export const getWhatsappFailure = (error: string) => ({
  type: GET_WHATSAPP_FAILURE,
  payload: error,
<<<<<<< HEAD
});
=======
});
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
