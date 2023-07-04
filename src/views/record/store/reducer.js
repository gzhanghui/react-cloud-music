import { fromJS } from "immutable";
import * as constants from "./constants";
const defaultState = fromJS({
  record: [],
});

export default (state = defaultState, action) => {
  const { type } = action;
  if (type === constants.RECORD_REQUEST) {
    return state.set("record", action.payload.record);
  }

  return state;
};
