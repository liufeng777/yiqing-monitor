import { createStore } from 'redux';
import { types } from './types';

const initialState = {
  tokenInvalid: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_TOKEN_STATUS:
      return {
        ...state,
        tokenInvalid: action.payload
      };
    default:
      return state;
  }
};

export const storeInstance = createStore(reducer);
