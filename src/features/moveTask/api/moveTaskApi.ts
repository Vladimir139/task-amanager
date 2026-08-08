import { getBoardProjectTagId, getBoardTagId } from "@/entities/board";
import { baseApi } from "@/shared/api";
import type { TaskRecord } from "@/shared/api/types";

export interface MoveTaskPayload {
  afterTaskId?: string;
  beforeTaskId?: string;
  boardId: string;
  projectId: string;
  sourceColumnId: string;
  targetColumnId: string;
  taskId: string;
}

const getTaskInvalidationTags = ({ boardId, projectId, taskId }: MoveTaskPayload) => [
  "Dashboard" as const,
  "Tasks" as const,
  { id: getBoardProjectTagId(projectId), type: "Board" as const },
  { id: getBoardTagId(boardId), type: "Board" as const },
  { id: taskId, type: "Tasks" as const },
];

export const moveTaskApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    moveTask: build.mutation<TaskRecord, MoveTaskPayload>({
      invalidatesTags: (_result, _error, payload) => getTaskInvalidationTags(payload),
      query: ({ boardId: _boardId, projectId: _projectId, taskId, ...body }) => ({
        body,
        method: "PATCH",
        url: `/tasks/${taskId}/move`,
      }),
    }),
  }),
});

export const { useMoveTaskMutation } = moveTaskApi;
