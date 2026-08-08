import { getBoardProjectTagId, getBoardTagId } from "@/entities/board";
import { baseApi } from "@/shared/api";
import type { TaskRecord } from "@/shared/api/types";

interface TaskParticipantPayload {
  boardId: string;
  projectId: string;
  taskId: string;
  userIds: string[];
}

const getTaskInvalidationTags = ({ boardId, projectId, taskId }: TaskParticipantPayload) => [
  "Dashboard" as const,
  "Tasks" as const,
  { id: getBoardProjectTagId(projectId), type: "Board" as const },
  { id: getBoardTagId(boardId), type: "Board" as const },
  { id: taskId, type: "Tasks" as const },
];

export const taskParticipantsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateTaskAssignees: build.mutation<TaskRecord, TaskParticipantPayload>({
      invalidatesTags: (_result, _error, payload) => getTaskInvalidationTags(payload),
      query: ({ taskId, userIds }) => ({
        body: { userIds },
        method: "PATCH",
        url: `/tasks/${taskId}/assignees`,
      }),
    }),
    updateTaskWatchers: build.mutation<TaskRecord, TaskParticipantPayload>({
      invalidatesTags: (_result, _error, payload) => getTaskInvalidationTags(payload),
      query: ({ taskId, userIds }) => ({
        body: { userIds },
        method: "PATCH",
        url: `/tasks/${taskId}/watchers`,
      }),
    }),
  }),
});

export const { useUpdateTaskAssigneesMutation, useUpdateTaskWatchersMutation } =
  taskParticipantsApi;
