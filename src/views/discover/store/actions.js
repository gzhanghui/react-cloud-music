import * as constants from "./constants";

export const playlistRequest = (playlist) => ({
  type: constants.RECOMMEND_PLAYLIST_REQUEST,
  playlist,
});
export const getPlaylistAction = () => ({
  type: constants.PERSONALIZED_PLAYLIST,
});

export const newsongRequest = (songs) => ({
  type: constants.PERSONALIZED_NEWSONG_REQUEST,
  songs,
});

export const getSongsAction = () => ({
  type: constants.PERSONALIZED_NEWSONG,
});

export const newAlbumRequest = (newAlbum) => ({
  type: constants.NEW_ALBUM_REQUEST,
  payload: { newAlbum },
});

export const getNewAlbumAction = () => ({
  type: constants.GET_NEW_ALBUM,
});

export const getBannerRequest = (banner) => ({
  type: constants.GET_BANNER_REQUEST,
  banner,
});
export const getBannerAction = () => ({
  type: constants.GET_BANNER,
});

export const bannerChangeAction = (bannerIndex) => ({
  type: constants.BANNER_INDEX,
  bannerIndex,
});

export const insertSongAction = (insertSong) => ({
  type: constants.INSERT_SONG,
  insertSong,
});
