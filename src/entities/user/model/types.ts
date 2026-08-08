export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roleTitle?: string;
  avatarUrl?: string | null;
  sessionId?: string;
}

export interface UserSchema {
  authData: AuthUser | null;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar: string;
}

export type UserProfileField = "firstName" | "lastName" | "email" | "role";
