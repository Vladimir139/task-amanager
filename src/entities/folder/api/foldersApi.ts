import { baseApi } from "@/shared/api";
import type { FolderRecord } from "@/shared/api/types";

export interface CreateFolderPayload {
  color?: string;
  name: string;
  parentId?: string;
  projectId?: string;
}

export interface UpdateFolderPayload {
  color?: string;
  folderId: string;
  name?: string;
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
      providesTags: (result) => [
        "Folders",
        ...(result?.map((folder) => ({ id: folder._id, type: "Folders" as const })) ?? []),
      ],
      query: () => "/folders",
    }),
    getFolderById: build.query<FolderRecord, string>({
      providesTags: (_result, _error, folderId) => [{ id: folderId, type: "Folders" }],
      query: (folderId) => `/folders/${folderId}`,
    }),
    updateFolder: build.mutation<FolderRecord, UpdateFolderPayload>({
      invalidatesTags: (_result, _error, payload) => [
        "Folders",
        "Files",
        "Storage",
        "Activity",
        { id: payload.folderId, type: "Folders" },
      ],
      query: ({ folderId, ...body }) => ({
        body,
        method: "PATCH",
        url: `/folders/${folderId}`,
      }),
    }),
    deleteFolder: build.mutation<FolderRecord, string>({
      invalidatesTags: (_result, _error, folderId) => [
        "Folders",
        "Files",
        "Storage",
        "Activity",
        { id: folderId, type: "Folders" },
      ],
      query: (folderId) => ({
        method: "DELETE",
        url: `/folders/${folderId}`,
      }),
    }),
  }),
});

export const {
  useCreateFolderMutation,
  useDeleteFolderMutation,
  useGetFolderByIdQuery,
  useGetFoldersQuery,
  useUpdateFolderMutation,
} = foldersApi;
