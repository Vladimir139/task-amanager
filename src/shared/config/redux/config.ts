import {
  configureStore,
  type EnhancedStore,
  type Middleware,
  type Reducer,
} from "@reduxjs/toolkit";

import { baseApi } from "@/shared/config/query";

import type { StateSchema } from "./StateSchema";
import type { ExtraArgument } from "./types";

interface CreateReduxStoreParams {
  initialState?: StateSchema;
  reducers: Reducer<StateSchema>;
  middleware?: Middleware;
  extraArgument?: ExtraArgument;
}

export const createReduxStore = ({
  initialState,
  reducers,
  middleware,
  extraArgument,
}: CreateReduxStoreParams): EnhancedStore<StateSchema> => {
  const middlewares = middleware ? [baseApi.middleware, middleware] : [baseApi.middleware];

  return configureStore({
    reducer: reducers,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument,
        },
      }).concat(middlewares),
  });
};
