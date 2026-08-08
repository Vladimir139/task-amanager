import { getBoardProjectTagId, getBoardTagId } from "@/entities/board";
import { baseApi } from "@/shared/api";
import type { BoardRecord } from "@/shared/api/types";

export interface CreateBoardPayload {
  description?: string;
  emoji?: string;
  projectId: string;
  title: string;
}

export interface UpdateBoardPayload {
  boardId: string;
  description?: string;
  emoji?: string;
  projectId: string;
  title?: string;
}

export interface DeleteBoardPayload {
  boardId: string;
  projectId: string;
}

const getBoardInvalidationTags = (projectId: string, boardId?: string) => [
  { id: getBoardProjectTagId(projectId), type: "Board" as const },
  ...(boardId ? [{ id: getBoardTagId(boardId), type: "Board" as const }] : []),
];

export const boardCrudApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createBoard: build.mutation<BoardRecord, CreateBoardPayload>({
      invalidatesTags: (_result, _error, payload) => getBoardInvalidationTags(payload.projectId),
      query: ({ projectId, ...body }) => ({
        body,
        method: "POST",
        url: `/projects/${projectId}/boards`,
      }),
    }),
    deleteBoard: build.mutation<BoardRecord, DeleteBoardPayload>({
      invalidatesTags: (_result, _error, payload) => [
        ...getBoardInvalidationTags(payload.projectId, payload.boardId),
        "Tasks",
      ],
      query: ({ boardId }) => ({
        method: "DELETE",
        url: `/boards/${boardId}`,
      }),
    }),
    updateBoard: build.mutation<BoardRecord, UpdateBoardPayload>({
      invalidatesTags: (_result, _error, payload) =>
        getBoardInvalidationTags(payload.projectId, payload.boardId),
      query: ({ boardId, projectId: _projectId, ...body }) => ({
        body,
        method: "PATCH",
        url: `/boards/${boardId}`,
      }),
    }),
  }),
});

export const { useCreateBoardMutation, useDeleteBoardMutation, useUpdateBoardMutation } =
  boardCrudApi;
