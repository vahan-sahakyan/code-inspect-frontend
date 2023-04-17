import { createSelector } from '@reduxjs/toolkit';

import { TRootState } from './store';

export const selectUserRole = (state: TRootState) => state.user.userRole || localStorage.getItem('userRole');

export const selectIsCodeReviewer = createSelector([selectUserRole], userRole => userRole === 'ROLE_CODE_REVIEWER');
