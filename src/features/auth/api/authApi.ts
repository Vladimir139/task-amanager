import { baseApi } from "@/shared/api";
import type { AuthResponse } from "@/shared/api/types";

import { clearAuthSession } from "../lib/session";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  firstName: string;
  lastName: string;
  roleTitle: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, LoginPayload>({
      query: (body) => ({
        body,
        method: "POST",
        url: "/auth/login",
      }),
    }),
    logout: build.mutation<{ loggedOut: true }, void>({
      query: () => ({
        method: "POST",
        url: "/auth/logout",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          clearAuthSession(dispatch);
        } catch {
          // handled by RTK Query error state
        }
      },
    }),
    register: build.mutation<AuthResponse, RegisterPayload>({
      query: (body) => ({
        body,
        method: "POST",
        url: "/auth/register",
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } = authApi;
