import { CREATE_USER, EDIT_USER, DELETE_USER, GET_USERS } from "../actionTypes/userActionTypes";

export const getUsersAction = () => ({
  type: GET_USERS,
});
export const createNewUser = (payload: any) => ({
  type: CREATE_USER,
  payload,
});
export const editUser = (payload: any) => ({
  type: EDIT_USER,
  payload,
});
export const deleteUserAction = (payload: any) => ({
  type: DELETE_USER,
  payload,
});
