import { getBoardProjectTagId, getBoardTagId } from "@/entities/board";
import { baseApi } from "@/shared/api";
import type { TaskChecklistItemRecord, TaskRecord } from "@/shared/api/types";

export interface UpdateTaskPayload {
  assigneeIds?: string[];
  boardId: string;
  category?: string;
  checklistCompleted?: number;
  checklistItems?: TaskChecklistItemRecord[];
  checklistTotal?: number;
  columnId?: string;
  description?: string;
  dueDate?: string;
  emoji?: string;
  priority?: string;
  projectId: string;
  startDate?: string;
  taskId: string;
  title?: string;
  workflowState?: string;
}

const getTaskInvalidationTags = (projectId: string, boardId: string, taskId: string) => [
  "Dashboard" as const,
  "ProjectStats" as const,
  "Projects" as const,
  "Tasks" as const,
  { id: getBoardProjectTagId(projectId), type: "Board" as const },
  { id: getBoardTagId(boardId), type: "Board" as const },
  { id: taskId, type: "Tasks" as const },
];

export const updateTaskApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateTask: build.mutation<TaskRecord, UpdateTaskPayload>({
      invalidatesTags: (_result, _error, payload) =>
        getTaskInvalidationTags(payload.projectId, payload.boardId, payload.taskId),
      query: ({ boardId: _boardId, projectId: _projectId, taskId, ...body }) => ({
        body,
        method: "PATCH",
        url: `/tasks/${taskId}`,
      }),
    }),
  }),
});

export const { useUpdateTaskMutation } = updateTaskApi;
