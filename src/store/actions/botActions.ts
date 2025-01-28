import {
  CREATE_BOT,
  DELETE_BOT,
  EDIT_BOT,
  GET_BOTS,
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
