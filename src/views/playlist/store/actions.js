import * as constants from "./constants";

export const playlistRequest = (playlist) => ({
  type: constants.PLAYLIST_REQUEST,
  payload: { playlist },
});

export const playlistAction = () => ({
  type: constants.GET_PLAYLIST,
});

export const catalogueRequest = (catalogue) => ({
  type: constants.CATALOGUE_REQUEST,
  payload: { catalogue },
});

export const catalogueAction = () => ({
  type: constants.CATALOGUE,
});

export const highQualityTagsRequest = (highQualityTags) => ({
  type: constants.HIGH_QUALITY_TAGS_REQUEST,
  payload: { highQualityTags },
});

export const highQualityTagsAction = () => ({
  type: constants.HIGH_QUALITY_TAGS,
});

export const hotTagsRequest = (hotTags) => ({
  type: constants.HOT_TAGS_REQUEST,
  payload: { hotTags },
});

export const hotTagsAction = () => ({
  type: constants.HOT_TAGS,
});
