import { getBoardProjectTagId, getBoardTagId } from "@/entities/board";
import { baseApi } from "@/shared/api";
import type { BoardColumnRecord } from "@/shared/api/types";

export interface CreateBoardColumnPayload {
  boardId: string;
  color?: string;
  position?: number;
  projectId: string;
  title: string;
}

export interface UpdateBoardColumnPayload {
  boardId: string;
  color?: string;
  columnId: string;
  isLocked?: boolean;
  position?: number;
  projectId: string;
  title?: string;
}

export interface ReorderBoardColumnsPayload {
  boardId: string;
  items: Array<{
    columnId: string;
    position: number;
  }>;
  projectId: string;
}

export interface DeleteBoardColumnPayload {
  boardId: string;
  columnId: string;
  projectId: string;
  targetColumnId?: string;
}

const getBoardInvalidationTags = (projectId: string, boardId: string) => [
  "Tasks" as const,
  { id: getBoardProjectTagId(projectId), type: "Board" as const },
  { id: getBoardTagId(boardId), type: "Board" as const },
];

export const boardColumnsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createBoardColumn: build.mutation<BoardColumnRecord, CreateBoardColumnPayload>({
      invalidatesTags: (_result, _error, payload) =>
        getBoardInvalidationTags(payload.projectId, payload.boardId),
      query: ({ boardId, projectId: _projectId, ...body }) => ({
        body,
        method: "POST",
        url: `/boards/${boardId}/columns`,
      }),
    }),
    deleteBoardColumn: build.mutation<
      { deleted: boolean; movedTasks: number },
      DeleteBoardColumnPayload
    >({
      invalidatesTags: (_result, _error, payload) =>
        getBoardInvalidationTags(payload.projectId, payload.boardId),
      query: ({ boardId, columnId, projectId: _projectId, targetColumnId }) => ({
        method: "DELETE",
        params: targetColumnId ? { targetColumnId } : undefined,
        url: `/boards/${boardId}/columns/${columnId}`,
      }),
    }),
    reorderBoardColumns: build.mutation<BoardColumnRecord[], ReorderBoardColumnsPayload>({
      invalidatesTags: (_result, _error, payload) =>
        getBoardInvalidationTags(payload.projectId, payload.boardId),
      query: ({ boardId, items, projectId: _projectId }) => ({
        body: { items },
        method: "PATCH",
        url: `/boards/${boardId}/columns/reorder`,
      }),
    }),
    updateBoardColumn: build.mutation<BoardColumnRecord, UpdateBoardColumnPayload>({
      invalidatesTags: (_result, _error, payload) =>
        getBoardInvalidationTags(payload.projectId, payload.boardId),
      query: ({ boardId, columnId, projectId: _projectId, ...body }) => ({
        body,
        method: "PATCH",
        url: `/boards/${boardId}/columns/${columnId}`,
      }),
    }),
  }),
});

export const {
  useCreateBoardColumnMutation,
  useDeleteBoardColumnMutation,
  useReorderBoardColumnsMutation,
  useUpdateBoardColumnMutation,
} = boardColumnsApi;
