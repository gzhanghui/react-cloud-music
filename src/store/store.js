import { configureStore } from '@reduxjs/toolkit';
import counterReducer from 'pages/counter/counterSlice';
import playerSlice from 'components/player/player-slice';
import homeSlice from 'pages/home/home-slice';
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    home:homeSlice,
    player: playerSlice
  },
  devTools:true,
});
