import { CREATE_BOT } from "../actionTypes/botActionsTypes";
export const createBotAction = (payload: any) => ({
    type: CREATE_BOT,
    payload,
  });