import { combineReducers } from "redux-immutable";
import { reducer as recommendReducer } from "@/views/discover/store";
import { reducer as playerReducer } from "@/components/player/store";
import { reducer as songListReducer } from "@/components/player/store";
import { reducer as loginReducer } from "@/components/login/store";
import { reducer as searchReducer } from "@/components/search/store";
import { reducer as menuReducer } from "@/components/menu/store";
import { reducer as likeReducer } from "@/views/like/store";
import { reducer as recordReducer } from "@/views/record/store";
import { reducer as toplistReducer } from "@/views/toplist/store";
import { reducer as playlistReducer } from "@/views/playlist/store";

export default combineReducers({
  discover: recommendReducer,
  player: playerReducer,
  list: songListReducer,
  login: loginReducer,
  search: searchReducer,
  menu: menuReducer,
  like: likeReducer,
  record: recordReducer,
  toplist: toplistReducer,
  playlist: playlistReducer,
});
