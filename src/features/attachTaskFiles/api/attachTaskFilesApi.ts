import { getBoardProjectTagId, getBoardTagId } from "@/entities/board";
import { baseApi } from "@/shared/api";
import type { TaskRecord } from "@/shared/api/types";

export interface AttachTaskFilesPayload {
  boardId: string;
  fileIds: string[];
  projectId: string;
  taskId: string;
}

const getTaskInvalidationTags = ({ boardId, projectId, taskId }: AttachTaskFilesPayload) => [
  "Dashboard" as const,
  "Files" as const,
  "Tasks" as const,
  { id: getBoardProjectTagId(projectId), type: "Board" as const },
  { id: getBoardTagId(boardId), type: "Board" as const },
  { id: taskId, type: "Tasks" as const },
];

export const attachTaskFilesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    attachTaskFiles: build.mutation<TaskRecord, AttachTaskFilesPayload>({
      invalidatesTags: (_result, _error, payload) => getTaskInvalidationTags(payload),
      query: ({ fileIds, taskId }) => ({
        body: { fileIds },
        method: "POST",
        url: `/tasks/${taskId}/attachments`,
      }),
    }),
  }),
});

export const { useAttachTaskFilesMutation } = attachTaskFilesApi;
