
import { CREATE_BOT,CREATE_BOT_SUCCESS,CREATE_BOT_FAILURE } from '../actionTypes/botActionsTypes';
import { initialState } from '../initialState';
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
      default:
        return state;
    }
  }