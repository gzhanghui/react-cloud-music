import * as constants from "./constants";

export const toggleSearchPanelAction = (visible) => ({
  type: constants.OPEN_PANEL,
  payload: { visible },
});

export const getSearchHot = () => ({
  type: constants.GET_SEARCH_HOT,
});
export const getSearchHotAsync = (hot) => ({
  type: constants.GET_SEARCH_HOT_ASYNC,
  payload: { hot },
});

export const getSearchSuggest = (keywords) => ({
  type: constants.GET_SEARCH_SUGGEST,
  payload: { keywords },
});

export const getSearchSuggestAsync = (suggest) => ({
  type: constants.GET_SEARCH_SUGGEST_ASYNC,
  payload: { suggest },
});

export const changeKeywords = (keywords) => ({
  type: constants.CHANGE_KEYWORDS,
  payload: { keywords },
});
