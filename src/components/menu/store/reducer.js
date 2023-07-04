import { fromJS } from "immutable";
import * as constants from "./constants";
const defaultState = fromJS({
  playlist: [],
});

export default (state = defaultState, action) => {
  const { type } = action;
  if (type === constants.PLAYLIST_REQUEST) {
    return state.set("playlist", action.payload.playlist);
  }

  return state;
};
