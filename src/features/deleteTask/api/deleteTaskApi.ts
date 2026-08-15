import { getBoardProjectTagId, getBoardTagId } from "@/entities/board";
import { baseApi } from "@/shared/api";
import type { TaskRecord } from "@/shared/api/types";

export interface DeleteTaskPayload {
  boardId: string;
  projectId: string;
  taskId: string;
}

const getTaskInvalidationTags = ({ boardId, projectId, taskId }: DeleteTaskPayload) => [
  "Dashboard" as const,
  "ProjectStats" as const,
  "Projects" as const,
  "Tasks" as const,
  { id: getBoardProjectTagId(projectId), type: "Board" as const },
  { id: getBoardTagId(boardId), type: "Board" as const },
  { id: taskId, type: "Tasks" as const },
];

export const deleteTaskApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    deleteTask: build.mutation<TaskRecord, DeleteTaskPayload>({
      invalidatesTags: (_result, _error, payload) => getTaskInvalidationTags(payload),
      query: ({ taskId }) => ({
        method: "DELETE",
        url: `/tasks/${taskId}`,
      }),
    }),
  }),
});

export const { useDeleteTaskMutation } = deleteTaskApi;
