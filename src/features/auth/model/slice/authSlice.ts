import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { getStoredAuthTokens } from "@/shared/lib/auth/authStorage";

import type { AuthSchema } from "../types/authSchema";

interface AuthTokensPayload {
  accessToken: string;
  refreshToken: string;
}

const storedTokens = getStoredAuthTokens();

const initialState: AuthSchema = {
  accessToken: storedTokens.accessToken,
  refreshToken: storedTokens.refreshToken,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    setTokens: (state, action: PayloadAction<AuthTokensPayload>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
});

export const { actions: authActions } = authSlice;
export const { reducer: authReducer } = authSlice;
