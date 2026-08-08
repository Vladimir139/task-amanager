import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthUser, UserSchema } from "../types";

const initialState: UserSchema = {
  authData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearAuthData: (state) => {
      state.authData = null;
    },
    setAuthData: (state, action: PayloadAction<AuthUser>) => {
      state.authData = action.payload;
    },
  },
});

export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;
