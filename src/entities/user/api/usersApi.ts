import { baseApi } from "@/shared/api";
import type { UserRecord } from "@/shared/api/types";

export interface UpdateCurrentUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  roleTitle: string;
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
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
  useGetCurrentUserQuery,
  useGetUsersQuery,
  useUpdateCurrentUserMutation,
  useUploadAvatarMutation,
} = usersApi;
