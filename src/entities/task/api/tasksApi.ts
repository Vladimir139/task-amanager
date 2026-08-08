import { baseApi } from "@/shared/api";
import type { TaskRecord } from "@/shared/api/types";

export interface GetTasksQuery {
  assigneeId?: string;
  boardId?: string;
  columnId?: string;
  projectId?: string;
  search?: string;
}

const removeEmpty = (value: GetTasksQuery) =>
  Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== ""));

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTaskById: build.query<TaskRecord, string>({
      providesTags: (_result, _error, taskId) => [{ id: taskId, type: "Tasks" }],
      query: (taskId) => `/tasks/${taskId}`,
    }),
    getTasks: build.query<TaskRecord[], GetTasksQuery | void>({
      providesTags: (result) => [
        "Tasks",
        ...(result ?? []).map((task) => ({ id: task._id, type: "Tasks" as const })),
      ],
      query: (params) => ({
        params: removeEmpty(params ?? {}),
        url: "/tasks",
      }),
    }),
  }),
});

export const { useGetTaskByIdQuery, useGetTasksQuery } = tasksApi;
