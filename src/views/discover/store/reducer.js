import { fromJS } from "immutable";
import * as constants from "./constants";
const defaultState = fromJS({
  playlist: [],
  newsong: [],
  newAlbum: [],
  banner: [],
  bannerIndex: 0,
});
export default (state = defaultState, action) => {
  const { type } = action;

  if (type === constants.RECOMMEND_PLAYLIST_REQUEST) {
    return state.set("playlist", action.playlist);
  }

  if (type === constants.PERSONALIZED_NEWSONG_REQUEST) {
    return state.set("newsong", action.songs);
  }

  if (type === constants.NEW_ALBUM_REQUEST) {
    return state.set("newAlbum", action.payload.newAlbum);
  }

  if (type === constants.GET_BANNER_REQUEST) {
    return state.set("banner", action.banner);
  }

  if (type === constants.BANNER_INDEX) {
    return state.set("bannerIndex", action.bannerIndex);
  }

  return state;
};
