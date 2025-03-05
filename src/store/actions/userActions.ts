import { DELETE_USER, GET_USERS } from "../actionTypes/userActionTypes";

export const getUsersAction = () => ({
  type: GET_USERS,
});
export const deleteUserAction = (payload: any) => ({
  type: DELETE_USER,
  payload,
});
