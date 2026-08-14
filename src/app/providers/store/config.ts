import { combineReducers } from "@reduxjs/toolkit";

import { projectSelectionReducer } from "@/entities/project";
import { userReducer } from "@/entities/user";
import { authReducer } from "@/features/auth/model/slice/authSlice";
import { baseApi } from "@/shared/config/query";
import { clearStore, createReduxStore, type StateSchema } from "@/shared/config/redux";

export const reducers = {
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  projectSelection: projectSelectionReducer,
  user: userReducer,
};

const appReducer = combineReducers(reducers);

const rootReducer: typeof appReducer = (state, action) => {
  if (clearStore.match(action)) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export const getStore = (initialState?: StateSchema): ReturnType<typeof createReduxStore> =>
  createReduxStore({
    initialState,
    reducers: rootReducer,
  });

export const store = getStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
