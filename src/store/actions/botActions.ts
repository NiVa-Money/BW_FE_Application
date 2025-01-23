<<<<<<< Updated upstream
import { CREATE_BOT, EDIT_BOT, GET_BOTS } from "../actionTypes/botActionsTypes";
export const createBotAction = (payload: any) => ({
    type: CREATE_BOT,
    payload,
  });

export const editBotAction = (payload: any) => ({
    type: EDIT_BOT,
    payload,
=======
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
>>>>>>> Stashed changes
});
export const getBotsAction = (payload: any) => ({
  type: GET_BOTS,
  payload,
<<<<<<< Updated upstream
});
=======
});
>>>>>>> Stashed changes
