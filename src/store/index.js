import { createStore } from 'redux';
import { types } from './types';

const initialState = {
  tokenInvalid: false,
  areaCode: +sessionStorage.getItem('areaCode') || 0,
  // 各个页面的搜索信息
  searchInfo: {
    admin: {},
    card: {},
    detect: {},
    device: {},
    inspect: {},
    point: {},
    project: {},
    projectUser: {},
    user: {},
    warn: {}
  }
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
    case types.SET_SEARCH_INFO:
      const oldData = state.searchInfo[action.payload.type];
      const searchInfo = {
        ...state.searchInfo,
        [action.payload.type]: {
          ...oldData,
          ...action.payload.data
        }
      };
      return {
        ...state,
        searchInfo
      }
    default:
      return state;
  }
};

export const storeInstance = createStore(reducer);
