import type { AuthPayload, UserRecord } from "@/shared/api/types";

import type { AuthUser, UserProfile } from "../types";

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
});
