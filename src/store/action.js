import { types } from './types';

export const setTokenInvalid = (val) => {
  return {
    type: types.SET_TOKEN_STATUS,
    tokenInvalid: val,
  };
};
