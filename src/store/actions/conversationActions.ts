/* eslint-disable @typescript-eslint/no-explicit-any */
import { ADVANCE_FEATURE, USER_ALL_SESSION } from "../actionTypes/conversationActionsTypes";

export const getAllSession = (userId: any) => ({
    type: USER_ALL_SESSION,
    payload: userId,
  });

  export const getAdvanceFeature = (payload: any) => ({
    type: ADVANCE_FEATURE,
    payload,
  });