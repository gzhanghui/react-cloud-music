import { fromJS } from "immutable";
import * as constants from "./constants";
const defaultState = fromJS({
  likeList: [],
});

export default (state = defaultState, action) => {
  const { type } = action;
  if (type === constants.LIKE_LIST_REQUEST) {
    return state.set("likeList", action.payload.likeList);
  }

  return state;
};
