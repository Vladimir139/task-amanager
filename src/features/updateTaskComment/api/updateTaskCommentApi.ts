import { getBoardProjectTagId, getBoardTagId } from "@/entities/board";
import { baseApi } from "@/shared/api";
import type { TaskCommentRecord } from "@/shared/api/types";

export interface UpdateTaskCommentPayload {
  boardId: string;
  commentId: string;
  fileIds?: string[];
  projectId: string;
  taskId: string;
  text?: string;
}

const getTaskCommentInvalidationTags = ({
  boardId,
  projectId,
  taskId,
}: UpdateTaskCommentPayload) => [
  "Dashboard" as const,
  "Tasks" as const,
  { id: getBoardProjectTagId(projectId), type: "Board" as const },
  { id: getBoardTagId(boardId), type: "Board" as const },
  { id: taskId, type: "Tasks" as const },
];

export const updateTaskCommentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateTaskComment: build.mutation<TaskCommentRecord, UpdateTaskCommentPayload>({
      invalidatesTags: (_result, _error, payload) => getTaskCommentInvalidationTags(payload),
      query: ({
        boardId: _boardId,
        commentId,
        projectId: _projectId,
        taskId: _taskId,
        ...body
      }) => ({
        body,
        method: "PATCH",
        url: `/task-comments/${commentId}`,
      }),
    }),
  }),
});

export const { useUpdateTaskCommentMutation } = updateTaskCommentApi;
