import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IUserInitialState {
  isLoading: boolean;
  error: string | null;
  userRole: string;
}

const userInitialState: IUserInitialState = {
  isLoading: false,
  error: null,
  userRole: '',
} as const;

const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    setUserRole: (state, action: PayloadAction<string>) => {
      state.userRole = action.payload;
      localStorage.setItem('userRole', action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase('', () => {
      //
    });
  },
});
export const { setUserRole } = userSlice.actions;

export default userSlice;
