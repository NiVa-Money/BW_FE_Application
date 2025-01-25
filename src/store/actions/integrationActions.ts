/* eslint-disable @typescript-eslint/no-explicit-any */
import { SAVE_WHATSAPPINT, SAVE_WHATSAPPINT_SUCCESS, SAVE_WHATSAPPINT_FAILURE } from "../actionTypes/integrationActionTypes";

export const saveWhatsapp = (data: any) => ({
    type: SAVE_WHATSAPPINT,
    payload: data,
  });
  
  export const saveWhatsappSuccess = (response: any) => ({
    type: SAVE_WHATSAPPINT_SUCCESS,
    payload: response,
  });
  
  export const saveWhatsappFailure = (error: any) => ({
    type: SAVE_WHATSAPPINT_FAILURE,
    payload: error,
  });