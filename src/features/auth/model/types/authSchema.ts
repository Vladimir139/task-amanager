export interface AuthSchema {
  accessToken: string | null;
  refreshToken: string | null;
  isInitialized: boolean;
}
