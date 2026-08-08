import { baseApi } from "@/shared/api";
import type { ActivityRecord, FileRecord, StorageSummaryRecord } from "@/shared/api/types";

export interface UploadFilePayload {
  file: File;
  folderId?: string;
  kind?: string;
  projectId?: string;
}

export const filesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFileActivity: build.query<ActivityRecord[], void>({
      providesTags: ["Activity"],
      query: () => "/files/activity",
    }),
    getRecentFiles: build.query<FileRecord[], void>({
      providesTags: ["Files"],
      query: () => "/files/recent",
    }),
    getStorageSummary: build.query<StorageSummaryRecord[], void>({
      providesTags: ["Storage"],
      query: () => "/files/storage-summary",
    }),
    uploadFile: build.mutation<FileRecord, UploadFilePayload>({
      invalidatesTags: ["Files", "Storage", "Activity", "Folders"],
      query: ({ file, folderId, kind, projectId }) => {
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
  useGetFileActivityQuery,
  useGetRecentFilesQuery,
  useGetStorageSummaryQuery,
  useUploadFileMutation,
} = filesApi;
