import { fromJS } from "immutable";
import * as constants from "./constants";
const defaultState = fromJS({
  toplist: [],
});

export default (state = defaultState, action) => {
  const { type } = action;
  if (type === constants.NEW_ALBUM_REQUEST) {
    return state.set("toplist", action.payload.toplist);
  }

  return state;
};
