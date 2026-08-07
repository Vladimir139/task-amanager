import type { RootState } from "./store";

export const selectAuthState = (state: RootState): RootState["auth"] => state.auth;
export const selectAuthUser = (state: RootState): RootState["auth"]["user"] => state.auth.user;
export const selectIsAuthenticated = (state: RootState): boolean => state.auth.user !== null;
