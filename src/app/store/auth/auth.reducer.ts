import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, (state, { userId, accessToken }) => ({
    ...state,
    userId,
    accessToken,
    isAuthenticated: true,
  })),
  on(AuthActions.logout, () => ({
    ...initialAuthState,
    isAuthenticated: false,
  }))
);