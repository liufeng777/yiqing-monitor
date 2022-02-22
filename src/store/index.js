import { createStore } from 'redux';
import { types } from './types';

const initialState = {
  tokenInvalid: false,
  areaCode: +sessionStorage.getItem('areaCode') || 0,
  areaPoint: JSON.parse(sessionStorage.getItem('areaPoint') || '{"lng":108.55,"lat":34.32}')
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_TOKEN_STATUS:
      return {
        ...state,
        tokenInvalid: action.payload
      };
    case types.SET_AREA_CODE:
      return {
        ...state,
        areaCode: action.payload
      }
    case types.SET_AREA_POINT:
      return {
        ...state,
        areaPoint: action.payload
      }
    default:
      return state;
  }
};

export const storeInstance = createStore(reducer);
