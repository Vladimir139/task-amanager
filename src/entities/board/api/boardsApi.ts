import { baseApi } from "@/shared/api";
import type { BoardColumnRecord, BoardRecord, BoardViewResponse } from "@/shared/api/types";

import { getBoardProjectTagId, getBoardTagId } from "../model/lib/board";

export interface GetBoardViewQuery {
  boardId?: string;
  projectId: string;
}

const getBoardTags = (projectId: string, boardId?: string) => [
  { id: getBoardProjectTagId(projectId), type: "Board" as const },
  ...(boardId ? [{ id: getBoardTagId(boardId), type: "Board" as const }] : []),
];

export const boardsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBoardById: build.query<BoardRecord, string>({
      providesTags: (_result, _error, boardId) => [{ id: getBoardTagId(boardId), type: "Board" }],
      query: (boardId) => `/boards/${boardId}`,
    }),
    getBoardColumns: build.query<BoardColumnRecord[], string>({
      providesTags: (_result, _error, boardId) => [{ id: getBoardTagId(boardId), type: "Board" }],
      query: (boardId) => `/boards/${boardId}/columns`,
    }),
    getBoards: build.query<BoardRecord[], string>({
      providesTags: (result, _error, projectId) => [
        ...getBoardTags(projectId),
        ...(result ?? []).map((board) => ({
          id: getBoardTagId(board._id),
          type: "Board" as const,
        })),
      ],
      query: (projectId) => `/projects/${projectId}/boards`,
    }),
    getBoardView: build.query<BoardViewResponse, GetBoardViewQuery>({
      providesTags: (result, _error, { boardId, projectId }) => [
        ...getBoardTags(projectId, result?.board._id ?? boardId),
      ],
      query: ({ boardId, projectId }) => ({
        params: boardId ? { boardId } : undefined,
        url: `/projects/${projectId}/board-view`,
      }),
    }),
  }),
});

export const {
  useGetBoardByIdQuery,
  useGetBoardColumnsQuery,
  useGetBoardsQuery,
  useGetBoardViewQuery,
} = boardsApi;
