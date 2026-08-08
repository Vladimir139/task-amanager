import { baseApi } from "@/shared/api";
import type { BoardViewResponse } from "@/shared/api/types";

export const boardsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBoardView: build.query<BoardViewResponse, string>({
      providesTags: (_result, _error, projectId) => [{ id: projectId, type: "Board" }],
      query: (projectId) => `/projects/${projectId}/board-view`,
    }),
  }),
});

export const { useGetBoardViewQuery } = boardsApi;
