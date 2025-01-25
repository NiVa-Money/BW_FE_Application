/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SAVE_WHATSAPPINT,
  SAVE_WHATSAPPINT_SUCCESS,
  SAVE_WHATSAPPINT_FAILURE,
} from "../actionTypes/integrationActionTypes";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

const whatsappReducer = (state = initialState, action: { type: any; payload: any; }) => {
  switch (action.type) {
    case SAVE_WHATSAPPINT:
      return { ...state, loading: true };
    case SAVE_WHATSAPPINT_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case SAVE_WHATSAPPINT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default whatsappReducer;
