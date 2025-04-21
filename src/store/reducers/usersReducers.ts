/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CREATE_USER,
  CREATE_USER_FAILURE,
  CREATE_USER_SUCCESS,
  DELETE_USER,
  DELETE_USER_FAILURE,
  DELETE_USER_SUCCESS,
  EDIT_USER,
  EDIT_USER_FAILURE,
  EDIT_USER_SUCCESS,
  GET_USERS,
  GET_USERS_FAILURE,
  GET_USERS_SUCCESS,
} from "../actionTypes/userActionTypes";
import { initialState } from "../initialState";

export default function usersReducers(state = initialState.users, action: any) {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        lists: { data: action.payload, loader: true },
      };
    case GET_USERS_SUCCESS:
      return {
        ...state,
        lists: { data: action.payload, loader: false },
      };
    case GET_USERS_FAILURE:
      return {
        ...state,
        lists: { data: action.payload, loader: false },
      };
    case CREATE_USER:
      return {
        ...state,
        create: { data: action.payload, loader: true },
      };
    case CREATE_USER_SUCCESS:
      return {
        ...state,
        create: { data: action.payload, loader: false },
      };
    case CREATE_USER_FAILURE:
      return {
        ...state,
        create: { data: null, loader: false },
      };
    case EDIT_USER:
      return {
        ...state,
        edit: { data: action.payload, loader: true },
      };
    case EDIT_USER_SUCCESS:
      return {
        ...state,
        edit: { data: action.payload, loader: false },
      };
    case EDIT_USER_FAILURE:
      return {
        ...state,
        edit: { data: null, loader: false },
      };
    case DELETE_USER:
      return {
        ...state,
        delete: { data: action.payload, loader: true },
      };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        delete: { data: action.payload, loader: false },
      };
    case DELETE_USER_FAILURE:
      return {
        ...state,
        delete: { data: null, loader: false },
      };

    default:
      return state;
  }
}
