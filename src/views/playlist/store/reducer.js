import { fromJS, Map } from "immutable";
import * as constants from "./constants";
const defaultState = fromJS({
  playlist: {
    list: [],
    more: false,
    total: 0,
  },
  catalogue: {
    all: [],
    sub: [],
    categories: [],
  },
  highQualityTags: [],
  hotTags: [],
});

export default (state = defaultState, action) => {
  const { type, payload } = action;
  if (type === constants.PLAYLIST_REQUEST) {
    const data = payload.playlist;

    const res = {
      list: data.playlists,
      more: data.more,
      total: data.total,
      cat: data.cat,
    };

    return state.set("playlist", Map(res));
  }

  if (type === constants.CATALOGUE_REQUEST) {
    const data = payload.catalogue;

    return state.set("catalogue", Map(data));
  }
  if (type === constants.HIGH_QUALITY_TAGS_REQUEST) {
    return state.set("highQualityTags", payload.highQualityTags);
  }
  if (type === constants.HOT_TAGS_REQUEST) {
    return state.set("hotTags", payload.hotTags);
  }

  return state;
};
