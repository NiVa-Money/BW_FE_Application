/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  USER_ALL_SESSION,
  USER_All_SESSION_SUCCESS,
  USER_All_SESSION_FAILURE,
  ADVANCE_FEATURE,
  ADVANCE_FEATURE_FAILURE,
  ADVANCE_FEATURE_SUCCESS,
  GET_USER_All_SESSION_FAILURE_LIVE,
  GET_USER_All_SESSION_SUCCESS_LIVE,
  USER_ALL_SESSION_LIVE,
} from "../actionTypes/conversationActionsTypes";
import { initialState } from "../initialState";

export default function userChatReducers(
  state = initialState.userChat,
  action: any
) {
  switch (action.type) {
    case USER_ALL_SESSION:
      return {
        ...state,
        allSession: { data: action.payload, loader: false },
      };
    case USER_All_SESSION_SUCCESS:
      return {
        ...state,
        allSession: { data: action.payload, loader: true },
      };
    case USER_All_SESSION_FAILURE:
      return {
        ...state,
        allSession: { data: action.payload, loader: false },
      };

    case USER_ALL_SESSION_LIVE:
      return {
        ...state,
        allSessionLive: { data: action.payload, loader: false },
      };
    case GET_USER_All_SESSION_SUCCESS_LIVE:
      return {
        ...state,
        allSessionLive: { data: action.payload, loader: true },
      };
    case GET_USER_All_SESSION_FAILURE_LIVE:
      return {
        ...state,
        allSessionLive: { data: action.payload, loader: false },
      };
      
    case ADVANCE_FEATURE:
      return {
        ...state,
        advanceFeature: { data: action.payload, loader: true },
      };

    case ADVANCE_FEATURE_SUCCESS:
      return {
        ...state,
        advanceFeature: { data: action.payload, loader: true },
      };

    case ADVANCE_FEATURE_FAILURE:
      return {
        ...state,
        advanceFeature: { data: action.payload, loader: false },
      };

    default:
      return state;
  }
}
