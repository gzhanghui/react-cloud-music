import * as constants from "./constants";

export const playlistRequest = (playlist) => ({
  type: constants.PLAYLIST_REQUEST,
  payload: { playlist },
});

export const initLoginStatus = () => ({
  type: constants.INIT_LOGIN_STATUS,
});
