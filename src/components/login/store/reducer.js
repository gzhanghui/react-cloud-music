import { fromJS } from "immutable";
import * as constants from "./constants";
import { cacheUser } from "@/common/js/cache";

const defaultState = fromJS({
  visible: false,
  status: false,
  userinfo: {},
  account: "",
  password: "",
});
export default (state = defaultState, action) => {
  const { type } = action;
  switch (type) {
    case constants.VISIBLE: {
      return state.set("visible", !state.get("visible"));
    }

    case constants.LOGIN_STATUS_ASYNC: {
      return state.merge({
        status: action.payload.status,
        userinfo: action.payload.userinfo,
      });
    }
    case constants.LOGOUT_ASYNC: {
      return state.merge({
        status: action.payload.status,
        userinfo: {},
      });
    }

    case constants.LOGIN_ASYNC: {
      cacheUser.set(action.payload.userinfo);
      return state.set("userinfo", action.payload.userinfo);
    }

    case constants.CHANG_ACCOUNT: {
      return state.set("account", action.payload.account);
    }

    case constants.CHANGE_PASSWORD: {
      return state.set("password", action.payload.password);
    }

    default:
      return state;
  }
};
