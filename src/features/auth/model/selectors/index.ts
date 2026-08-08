import type { RootState } from "@/app/store";

export const selectAccessToken = (state: RootState): string | null => state.auth.accessToken;
export const selectRefreshToken = (state: RootState): string | null => state.auth.refreshToken;
export const selectAuthInitialized = (state: RootState): boolean => state.auth.isInitialized;
