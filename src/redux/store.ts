import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import userSlice from './user/user.slice';

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
  middleware: [logger],
});

export const { getState, dispatch } = store;

export type TRootState = ReturnType<typeof getState>;
export type TAppDispatch = typeof dispatch;

export default store;
