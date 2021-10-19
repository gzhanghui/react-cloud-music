import { configureStore } from '@reduxjs/toolkit';
import counterReducer from 'pages/counter/counterSlice';
import playerSlice from 'components/player/player-slice';
import homeSlice from 'pages/home/home-slice';
import loginSlice from 'components/login/login-slice'
import likeSlice from 'pages/like/like-slice'
import searchSlice from 'components/search/search-slice'
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    home:homeSlice,
    player: playerSlice,
    login:loginSlice,
    like:likeSlice,
    search: searchSlice
  },
  devTools:true,
});
