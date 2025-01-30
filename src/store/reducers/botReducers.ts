/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CREATE_BOT,
  CREATE_BOT_SUCCESS,
  CREATE_BOT_FAILURE,
  EDIT_BOT_FAILURE,
  EDIT_BOT_SUCCESS,
  EDIT_BOT,
  GET_BOTS,
  GET_BOTS_SUCCESS,
  GET_BOTS_FAILURE,
  DELETE_BOT,
  DELETE_BOT_SUCCESS,
  DELETE_BOT_FAILURE,
  RESET_SPECIFIC_STATE,
} from "../actionTypes/botActionsTypes";
import { initialState } from "../initialState";
export default function botProfileReducers(
  state = initialState.bot,
  action: any
) {
  switch (action.type) {
    case CREATE_BOT:
      return {
        ...state,
        create: {
          ...state.create,
          loader: true,
        },
      };
    case CREATE_BOT_SUCCESS:
      return {
        ...state,
        create: { data: action.payload, loader: true },
      };
    case CREATE_BOT_FAILURE:
      return {
        ...state,
        create: { data: action.payload, loader: false },
      };
    case EDIT_BOT:
      return {
        ...state,
        edit: {
          ...state.create,
          loader: true,
        },
      };
    case EDIT_BOT_SUCCESS:
      return {
        ...state,
        edit: { data: action.payload, loader: true },
      };
    case EDIT_BOT_FAILURE:
      return {
        ...state,
        edit: { data: action.payload, loader: false },
      };
    case DELETE_BOT:
      return {
        ...state,
        edit: {
          ...state.create,
          loader: true,
        },
      };
    case DELETE_BOT_SUCCESS:
      return {
        ...state,
        edit: { data: action.payload, loader: true },
      };
    case DELETE_BOT_FAILURE:
      return {
        ...state,
        edit: { data: action.payload, loader: false },
      };
    case GET_BOTS:
      return {
        ...state,
        lists: {
          ...state.create,
          loader: true,
        },
      };
    case GET_BOTS_SUCCESS:
      return {
        ...state,
        lists: { data: action.payload, loader: false },
      };
    case GET_BOTS_FAILURE:
      return {
        ...state,
        lists: { data: action.payload, loader: false },
      };
    case RESET_SPECIFIC_STATE:
      return {
        ...state,
        [action.state]: { data: null, loader: false }, // Reset to initial state
      };
    default:
      return state;
  }
}
