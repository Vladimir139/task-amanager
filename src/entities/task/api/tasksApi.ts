import { baseApi } from "@/shared/api";
import type { TaskRecord } from "@/shared/api/types";

export interface CreateTaskPayload {
  assigneeIds?: string[];
  boardId: string;
  category?: string;
  columnId: string;
  description?: string;
  emoji?: string;
  priority?: string;
  projectId: string;
  title: string;
}

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createTask: build.mutation<TaskRecord, CreateTaskPayload>({
      invalidatesTags: (_result, _error, payload) => [
        "Dashboard",
        "Tasks",
        { id: payload.projectId, type: "Board" },
      ],
      query: (body) => ({
        body,
        method: "POST",
        url: "/tasks",
      }),
    }),
  }),
});

export const { useCreateTaskMutation } = tasksApi;
