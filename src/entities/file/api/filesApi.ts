import { baseApi } from "@/shared/api";
import type { ActivityRecord, FileRecord, StorageSummaryRecord } from "@/shared/api/types";

export interface GetRecentFilesQuery {
  order?: "asc" | "desc";
  sort?: "lastModified" | "members" | "name" | "size";
}

export interface UploadFilePayload {
  conversationId?: string;
  file: File;
  folderId?: string;
  kind?: string;
  messageId?: string;
  projectId?: string;
}

export const filesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    deleteFile: build.mutation<FileRecord, string>({
      invalidatesTags: ["Files", "Storage", "Activity", "Folders", "ConversationFiles"],
      query: (fileId) => ({
        method: "DELETE",
        url: `/files/${fileId}`,
      }),
    }),
    getFileActivity: build.query<ActivityRecord[], void>({
      providesTags: ["Activity"],
      query: () => "/files/activity",
    }),
    getFileById: build.query<FileRecord, string>({
      providesTags: (_result, _error, fileId) => [{ id: fileId, type: "Files" }],
      query: (fileId) => `/files/${fileId}`,
    }),
    getRecentFiles: build.query<FileRecord[], GetRecentFilesQuery | void>({
      providesTags: ["Files"],
      query: (params) => ({
        params: params ?? undefined,
        url: "/files/recent",
      }),
    }),
    getStorageSummary: build.query<StorageSummaryRecord[], void>({
      providesTags: ["Storage"],
      query: () => "/files/storage-summary",
    }),
    uploadFile: build.mutation<FileRecord, UploadFilePayload>({
      invalidatesTags: ["Files", "Storage", "Activity", "Folders"],
      query: ({ conversationId, file, folderId, kind, messageId, projectId }) => {
        const formData = new FormData();
        formData.append("file", file);

        if (folderId) {
          formData.append("folderId", folderId);
        }

        if (kind) {
          formData.append("kind", kind);
        }

        if (projectId) {
          formData.append("projectId", projectId);
        }

        if (conversationId) {
          formData.append("conversationId", conversationId);
        }

        if (messageId) {
          formData.append("messageId", messageId);
        }

        return {
          body: formData,
          method: "POST",
          url: "/files/upload",
        };
      },
    }),
  }),
});

export const {
  useDeleteFileMutation,
  useGetFileActivityQuery,
  useGetFileByIdQuery,
  useGetRecentFilesQuery,
  useGetStorageSummaryQuery,
  useUploadFileMutation,
} = filesApi;
