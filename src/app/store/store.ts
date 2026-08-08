import { configureStore } from "@reduxjs/toolkit";

import { userReducer } from "@/entities/user";
import { authReducer } from "@/features/auth";
import { baseApi } from "@/shared/api";

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
