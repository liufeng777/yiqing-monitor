import { types } from './types';

// 登录token信息
export const setTokenInvalid = (val) => {
  return {
    type: types.SET_TOKEN_STATUS,
    payload: val,
  };
};

// 当前选择的区域
export const setAreaCode = (val) => {
  return {
    type: types.SET_AREA_CODE,
    payload: val,
  };
};

// 设置地图中心点
export const setAreaPoint = (val) => {
  return {
    type: types.SET_AREA_POINT,
    payload: val,
  };
};

// 设置打开的缓存路由
export const setCacheTags = (val) => {
  return {
    type: types.SET_CACHE_TAGS,
    payload: val,
  };
}

// 当前激活路由
export const switchTag = (val) => {
  return {
    type: types.SWITCH_TAG,
    payload: val,
  };
}
