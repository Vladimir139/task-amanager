import { baseApi } from "@/shared/api";
import type { TaskCommentRecord } from "@/shared/api/types";

export const taskCommentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTaskComments: build.query<TaskCommentRecord[], string>({
      providesTags: (_result, _error, taskId) => ["Tasks", { id: taskId, type: "Tasks" }],
      query: (taskId) => `/tasks/${taskId}/comments`,
    }),
  }),
});

export const { useGetTaskCommentsQuery } = taskCommentsApi;
