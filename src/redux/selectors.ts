import { createSelector } from '@reduxjs/toolkit';

import { RootState } from './store';

export const selectUserRole = (state: RootState) => state.user.userRole || localStorage.getItem('userRole');

export const selectIsCodeReviewer = createSelector([selectUserRole], userRole => userRole === 'ROLE_CODE_REVIEWER');
