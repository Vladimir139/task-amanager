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
  timezone: string;
  locale: string;
}

export interface UserNotificationSettings {
  emailEnabled: boolean;
  pushEnabled: boolean;
  messageSoundEnabled: boolean;
  marketingEnabled: boolean;
  taskAssignedEnabled: boolean;
  messageReceivedEnabled: boolean;
}

export interface UserPasswordForm {
  confirmPassword: string;
  currentPassword: string;
  newPassword: string;
}

export type UserNotificationField = keyof UserNotificationSettings;
export type UserPasswordField = keyof UserPasswordForm;
export type UserProfileField = "firstName" | "lastName" | "email" | "role" | "timezone" | "locale";
