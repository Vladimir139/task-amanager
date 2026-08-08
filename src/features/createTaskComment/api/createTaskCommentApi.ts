import { getBoardProjectTagId, getBoardTagId } from "@/entities/board";
import { baseApi } from "@/shared/api";
import type { TaskCommentRecord } from "@/shared/api/types";

export interface CreateTaskCommentPayload {
  boardId: string;
  fileIds?: string[];
  projectId: string;
  taskId: string;
  text: string;
}

const getTaskCommentInvalidationTags = ({
  boardId,
  projectId,
  taskId,
}: CreateTaskCommentPayload) => [
  "Dashboard" as const,
  "Tasks" as const,
  { id: getBoardProjectTagId(projectId), type: "Board" as const },
  { id: getBoardTagId(boardId), type: "Board" as const },
  { id: taskId, type: "Tasks" as const },
];

export const createTaskCommentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createTaskComment: build.mutation<TaskCommentRecord, CreateTaskCommentPayload>({
      invalidatesTags: (_result, _error, payload) => getTaskCommentInvalidationTags(payload),
      query: ({ boardId: _boardId, projectId: _projectId, taskId, ...body }) => ({
        body,
        method: "POST",
        url: `/tasks/${taskId}/comments`,
      }),
    }),
  }),
});

export const { useCreateTaskCommentMutation } = createTaskCommentApi;
