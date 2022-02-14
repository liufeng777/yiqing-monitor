import { types } from './types';

export const setTokenInvalid = (val) => {
  return {
    type: types.SET_TOKEN_STATUS,
    payload: val,
  };
};

export const setAreaCode = (val) => {
  return {
    type: types.SET_AREA_CODE,
    payload: val,
  };
};

// 设置搜索信息 payload: {type: string; data: any}
export const setSearchInfo = (val) => {
  return {
    type: types.SET_SEARCH_INFO,
    payload: val
  }
}
