import type { RootState } from "@/app/providers/store";

import type { AuthUser } from "../types";

export const selectAuthUser = (state: RootState): AuthUser | null => state.user.authData;
export const selectIsAuthenticated = (state: RootState): boolean => state.user.authData !== null;
