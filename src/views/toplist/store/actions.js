import * as constants from "./constants";

export const newAlbumRequest = (toplist) => ({
  type: constants.NEW_ALBUM_REQUEST,
  payload: { toplist },
});

export const toplistAction = () => ({
  type: constants.TOPLIST_ACTION,
});
