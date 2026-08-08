import { getBoardProjectTagId, getBoardTagId } from "@/entities/board";
import { baseApi } from "@/shared/api";
import type { TaskCommentRecord } from "@/shared/api/types";

export interface DeleteTaskCommentPayload {
  boardId: string;
  commentId: string;
  projectId: string;
  taskId: string;
}

const getTaskCommentInvalidationTags = ({
  boardId,
  projectId,
  taskId,
}: DeleteTaskCommentPayload) => [
  "Dashboard" as const,
  "Tasks" as const,
  { id: getBoardProjectTagId(projectId), type: "Board" as const },
  { id: getBoardTagId(boardId), type: "Board" as const },
  { id: taskId, type: "Tasks" as const },
];

export const deleteTaskCommentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    deleteTaskComment: build.mutation<TaskCommentRecord, DeleteTaskCommentPayload>({
      invalidatesTags: (_result, _error, payload) => getTaskCommentInvalidationTags(payload),
      query: ({ commentId }) => ({
        method: "DELETE",
        url: `/task-comments/${commentId}`,
      }),
    }),
  }),
});

export const { useDeleteTaskCommentMutation } = deleteTaskCommentApi;
