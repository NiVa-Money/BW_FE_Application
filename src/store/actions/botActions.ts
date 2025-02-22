/* eslint-disable @typescript-eslint/no-explicit-any */
<<<<<<< HEAD
import { CREATE_BOT } from "../actionTypes/botActionsTypes";
=======
import {
  CREATE_BOT,
  DELETE_BOT,
  EDIT_BOT,
  EXPORT_BOT_PROFILE,
  GET_BOTS,
  RESET_SPECIFIC_STATE,
  TEST_BOT,
} from "../actionTypes/botActionsTypes";

>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
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

export const botTestAction = (payload: any) => ({
  type: TEST_BOT,
  payload,
});
