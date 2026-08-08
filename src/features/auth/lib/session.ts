import type { AppDispatch } from "@/app/providers/store";
import { mapAuthPayloadToAuthUser, userActions } from "@/entities/user";
import type { AuthResponse } from "@/shared/api/types";
import { clearStore } from "@/shared/config/redux";
import { clearStoredAuthTokens, saveStoredAuthTokens } from "@/shared/lib/auth/authStorage";

import { authActions } from "../model/slice/authSlice";

export const applyAuthSession = (dispatch: AppDispatch, session: AuthResponse): void => {
  dispatch(
    authActions.setTokens({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    }),
  );
  dispatch(userActions.setAuthData(mapAuthPayloadToAuthUser(session.user)));
  dispatch(authActions.setInitialized(true));
  saveStoredAuthTokens({
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  });
};

export const clearAuthSession = (dispatch: AppDispatch): void => {
  clearStoredAuthTokens();
  dispatch(clearStore());
  dispatch(authActions.setInitialized(true));
};
