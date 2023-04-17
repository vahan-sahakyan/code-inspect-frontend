import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import userSlice from './user/user.slice';

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
  middleware: [logger],
});

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;

export default store;
