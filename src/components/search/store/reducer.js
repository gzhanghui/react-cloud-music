import { fromJS } from "immutable";
import * as constants from "./constants";
const defaultState = fromJS({
  visible: false,
  hot: [],
  suggest: [],
  keywords: "",
});

export default (state = defaultState, action) => {
  const { type } = action;
  if (type === constants.OPEN_PANEL) {
    return state.set("visible", action.payload.visible);
  }
  if (type === constants.GET_SEARCH_HOT_ASYNC) {
    return state.set("hot", action.payload.hot);
  }
  if (type === constants.GET_SEARCH_SUGGEST_ASYNC) {
    return state.set("suggest", action.payload.suggest);
  }
  if (type === constants.CHANGE_KEYWORDS) {
    return state.set("keywords", action.payload.keywords);
  }
  return state;
};
