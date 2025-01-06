import { CHATDATA } from "../actionTypes/authActionsTypes";


export const chatAction = (payload: any) => ({
    type: CHATDATA,
    payload,
  });