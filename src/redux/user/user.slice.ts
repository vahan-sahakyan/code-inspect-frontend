import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Role } from '../../App';

type UserInitialState = {
  isLoading: boolean;
  error: string | null;
  userRole: Role | '';
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoading: false,
    error: null,
    userRole: '',
  } as UserInitialState,
  reducers: {
    setUserRole: (state, action: PayloadAction<Role>) => {
      state.userRole = action.payload;
      localStorage.setItem('userRole', action.payload);
    },
  },
});

export const { setUserRole } = userSlice.actions;

export default userSlice;
