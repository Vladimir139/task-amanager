import { baseApi } from "@/shared/api";
import type { FolderRecord } from "@/shared/api/types";

export interface CreateFolderPayload {
  color?: string;
  name: string;
  parentId?: string;
  projectId?: string;
}

export const foldersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createFolder: build.mutation<FolderRecord, CreateFolderPayload>({
      invalidatesTags: ["Folders", "Files", "Storage", "Activity"],
      query: (body) => ({
        body,
        method: "POST",
        url: "/folders",
      }),
    }),
    getFolders: build.query<FolderRecord[], void>({
      providesTags: ["Folders"],
      query: () => "/folders",
    }),
  }),
});

export const { useCreateFolderMutation, useGetFoldersQuery } = foldersApi;
