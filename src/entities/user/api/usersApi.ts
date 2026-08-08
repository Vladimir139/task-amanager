import { baseApi } from "@/shared/api";
import type { NotificationSettingsRecord, UserRecord } from "@/shared/api/types";

export interface UpdateCurrentUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  roleTitle: string;
  timezone: string;
  locale: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export type UpdateNotificationSettingsPayload = NotificationSettingsRecord;

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    changePassword: build.mutation<{ updated: true }, ChangePasswordPayload>({
      query: (body) => ({
        body,
        method: "PATCH",
        url: "/users/me/password",
      }),
    }),
    getCurrentUser: build.query<UserRecord, void>({
      providesTags: ["CurrentUser"],
      query: () => "/users/me",
    }),
    getUsers: build.query<UserRecord[], void>({
      providesTags: ["Users"],
      query: () => "/users",
    }),
    updateCurrentUser: build.mutation<UserRecord, UpdateCurrentUserPayload>({
      invalidatesTags: ["CurrentUser", "Users"],
      query: (body) => ({
        body,
        method: "PATCH",
        url: "/users/me",
      }),
    }),
    updateNotificationSettings: build.mutation<UserRecord, UpdateNotificationSettingsPayload>({
      invalidatesTags: ["CurrentUser", "Users"],
      query: (body) => ({
        body,
        method: "PATCH",
        url: "/users/me/notifications-settings",
      }),
    }),
    uploadAvatar: build.mutation<UserRecord, File>({
      invalidatesTags: ["CurrentUser", "Users"],
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          body: formData,
          method: "POST",
          url: "/users/me/avatar",
        };
      },
    }),
  }),
});

export const {
  useChangePasswordMutation,
  useGetCurrentUserQuery,
  useGetUsersQuery,
  useUpdateCurrentUserMutation,
  useUpdateNotificationSettingsMutation,
  useUploadAvatarMutation,
} = usersApi;
