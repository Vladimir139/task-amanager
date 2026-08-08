import type { AuthPayload, UserRecord } from "@/shared/api/types";

import type { AuthUser, UserNotificationSettings, UserProfile } from "../types";

export const defaultNotificationSettings: UserNotificationSettings = {
  emailEnabled: true,
  marketingEnabled: false,
  messageReceivedEnabled: true,
  messageSoundEnabled: true,
  pushEnabled: true,
  taskAssignedEnabled: true,
};

export const mapAuthPayloadToAuthUser = (payload: AuthPayload): AuthUser => ({
  id: payload.sub,
  email: payload.email,
  firstName: payload.firstName,
  lastName: payload.lastName,
  sessionId: payload.sessionId,
});

export const mapUserRecordToAuthUser = (user: UserRecord): AuthUser => ({
  id: user._id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  roleTitle: user.roleTitle,
  avatarUrl: user.avatarUrl ?? null,
});

export const mapUserRecordToProfile = (user: UserRecord): UserProfile => ({
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.roleTitle,
  avatar: user.avatarUrl ?? "",
  timezone: user.timezone ?? "",
  locale: user.locale ?? "en",
});

export const mapUserRecordToNotificationSettings = (
  user: UserRecord,
): UserNotificationSettings => ({
  ...defaultNotificationSettings,
  ...user.notificationSettings,
});
