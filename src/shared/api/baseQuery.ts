import type { QueryReturnValue } from "@reduxjs/toolkit/query";
import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { mapAuthPayloadToAuthUser, userActions } from "@/entities/user";
import { authActions } from "@/features/auth";
import type { ApiSuccessResponse, AuthResponse } from "@/shared/api/types";
import { clearStoredAuthTokens, saveStoredAuthTokens } from "@/shared/lib/auth/authStorage";

interface AuthAwareState {
  auth: {
    accessToken: string | null;
    refreshToken: string | null;
  };
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL ?? "http://localhost:3005"}/api`,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as AuthAwareState;
    const accessToken = state.auth.accessToken;

    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

const unwrapData = <T>(value: unknown): T => {
  const response = value as ApiSuccessResponse<T>;

  return response.data;
};

const normalizeResult = <T>(
  result: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>,
): QueryReturnValue<T, FetchBaseQueryError, FetchBaseQueryMeta> => {
  if ("data" in result && result.data !== undefined) {
    return {
      ...result,
      data: unwrapData<T>(result.data),
    };
  }

  return result as QueryReturnValue<T, FetchBaseQueryError, FetchBaseQueryMeta>;
};

const handleUnauthorized = (api: BaseQueryApi) => {
  clearStoredAuthTokens();
  api.dispatch(authActions.clearAuth());
  api.dispatch(userActions.clearAuthData());
  api.dispatch(authActions.setInitialized(true));
};

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = normalizeResult<unknown>(await rawBaseQuery(args, api, extraOptions));

  if (result.error?.status !== 401) {
    return result;
  }

  const state = api.getState() as AuthAwareState;
  const refreshToken = state.auth.refreshToken;

  if (!refreshToken) {
    handleUnauthorized(api);
    return result;
  }

  const refreshResult = await rawBaseQuery(
    {
      body: { refreshToken },
      method: "POST",
      url: "/auth/refresh",
    },
    api,
    extraOptions,
  );

  if (!refreshResult.data) {
    handleUnauthorized(api);
    return result;
  }

  const refreshedSession = unwrapData<AuthResponse>(refreshResult.data);

  api.dispatch(
    authActions.setTokens({
      accessToken: refreshedSession.accessToken,
      refreshToken: refreshedSession.refreshToken,
    }),
  );
  api.dispatch(userActions.setAuthData(mapAuthPayloadToAuthUser(refreshedSession.user)));
  saveStoredAuthTokens({
    accessToken: refreshedSession.accessToken,
    refreshToken: refreshedSession.refreshToken,
  });

  result = normalizeResult<unknown>(await rawBaseQuery(args, api, extraOptions));

  return result;
};
