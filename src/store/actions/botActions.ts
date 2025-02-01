/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CREATE_BOT,
  DELETE_BOT,
  EDIT_BOT,
  EXPORT_BOT_PROFILE,
  GET_BOTS,
  RESET_SPECIFIC_STATE,
} from "../actionTypes/botActionsTypes";

export const createBotAction = (payload: any) => ({
  type: CREATE_BOT,
  payload,
});

export const editBotAction = (payload: any) => ({
  type: EDIT_BOT,
  payload,
});
export const deleteBotAction = (payload: any) => ({
  type: DELETE_BOT,
  payload,
});
export const getBotsAction = (payload: any) => ({
  type: GET_BOTS,
  payload,
});
export const resetBotAction = (state: any) => ({
  type: RESET_SPECIFIC_STATE,
  state,
});
export const exportBotProfileServiceAction = (data: any) => ({
  type: EXPORT_BOT_PROFILE,
  payload: data,
});
