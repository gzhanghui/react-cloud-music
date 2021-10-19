import { configureStore } from '@reduxjs/toolkit';
import playerSlice from 'components/player/player-slice';
import homeSlice from 'pages/home/home-slice';
import likeSlice from 'pages/like/like-slice'
import counterReducer from 'pages/counter/counterSlice';
import loginSlice from 'components/login/login-slice'
import searchSlice from 'components/search/search-slice'
import accountSlice from 'components/account/account-slice'
import searchResultSlice from 'pages/search-result/search-result-slice'
import mvSlice from 'pages/mv/mv-slice'
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    home:homeSlice,
    player: playerSlice,
    login:loginSlice,
    like:likeSlice,
    search: searchSlice,
    account:accountSlice,
    searchResult:searchResultSlice,
    mv:mvSlice
  },
  devTools:true,
});
