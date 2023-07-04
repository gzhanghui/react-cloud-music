import * as constants from "./constants";

export const changeVisibleAction = () => ({
  type: constants.VISIBLE,
});

export const getLoginStatusAsync = (status, userinfo) => ({
  type: constants.LOGIN_STATUS_ASYNC,
  payload: { status, userinfo },
});

export const getLoginStatusAction = () => ({
  type: constants.LOGIN_STATUS,
});

export const loginAction = (account, password) => ({
  type: constants.LOGIN,
  payload: { account, password },
});
export const loginAsync = (userinfo) => ({
  type: constants.LOGIN_ASYNC,
  payload: { userinfo },
});

export const changAccountAction = (account) => ({
  type: constants.CHANG_ACCOUNT,
  payload: { account },
});

export const changPasswordAction = (password) => ({
  type: constants.CHANGE_PASSWORD,
  payload: { password },
});

export const logoutAction = () => ({
  type: constants.LOGOUT,
});
export const logoutAsync = (status) => ({
  type: constants.LOGOUT_ASYNC,
  payload: { status },
});
