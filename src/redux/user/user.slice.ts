import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TRole } from '../../App';

type UserInitialState = {
  isLoading: boolean;
  error: string | null;
  userRole: string;
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoading: false,
    error: null,
    userRole: '',
  } as UserInitialState,
  reducers: {
    setUserRole: (state, action: PayloadAction<string>) => {
      state.userRole = action.payload;
      localStorage.setItem('userRole', action.payload);
    },
  },
});

export const { setUserRole } = userSlice.actions;

export default userSlice;
