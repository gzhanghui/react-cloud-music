import * as constants from "./constants";

export const likelistRequest = (likeList) => ({
  type: constants.LIKE_LIST_REQUEST,
  payload: { likeList },
});
