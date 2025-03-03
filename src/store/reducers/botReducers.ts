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
  EXPORT_BOT_PROFILE,
  EXPORT_BOT_PROFILE_SUCCESS,
  EXPORT_BOT_PROFILE_FAILURE,
  TEST_BOT,
  TEST_BOT_SUCCESS,
  TEST_BOT_FAILURE,
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
          ...state.edit,
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
        delete: {
          ...state.delete,
          loader: true,
        },
      };
    case DELETE_BOT_SUCCESS:
      return {
        ...state,
        delete: { data: action.payload, loader: true },
      };
    case DELETE_BOT_FAILURE:
      return {
        ...state,
        delete: { data: action.payload, loader: false },
      };
    case GET_BOTS:
      return {
        ...state,
        lists: {
          ...state.lists,
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
    case EXPORT_BOT_PROFILE:
      return {
        ...state,
        export: {
          ...state.export,
          loader: true,
        },
      };
    case EXPORT_BOT_PROFILE_SUCCESS:
      return {
        ...state,
        export: { data: action.payload, loader: false },
      };
    case EXPORT_BOT_PROFILE_FAILURE:
      return {
        ...state,
        export: { data: action.payload, loader: false },
      };
    case TEST_BOT:
      return {
        ...state,
        test: {
          ...state.test,
          loader: true,
        },
      };
    case TEST_BOT_SUCCESS:
      return {
        ...state,
        test: { data: action.payload, loader: false },
      };
    case TEST_BOT_FAILURE:
      return {
        ...state,
        test: { data: action.payload, loader: false },
      };
    default:
      return state;
  }
}
