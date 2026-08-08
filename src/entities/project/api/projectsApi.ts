import { baseApi } from "@/shared/api";
import type { ProjectListResponse, ProjectRecord, ProjectStatsResponse } from "@/shared/api/types";

export interface GetProjectsQuery {
  limit?: number;
  page?: number;
  search?: string;
  sort?: string;
  status?: string;
}

export interface CreateProjectPayload {
  title: string;
  description?: string;
  status?: string;
  color?: string;
  dueDate?: string;
}

const removeEmpty = (value: GetProjectsQuery) =>
  Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== ""));

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createProject: build.mutation<ProjectRecord, CreateProjectPayload>({
      invalidatesTags: ["Projects", "ProjectStats", "Board"],
      query: (body) => ({
        body,
        method: "POST",
        url: "/projects",
      }),
    }),
    getProjectStats: build.query<ProjectStatsResponse, void>({
      providesTags: ["ProjectStats"],
      query: () => "/projects/stats",
    }),
    getProjects: build.query<ProjectListResponse, GetProjectsQuery | void>({
      providesTags: ["Projects"],
      query: (params) => ({
        params: removeEmpty(params ?? {}),
        url: "/projects",
      }),
    }),
  }),
});

export const { useCreateProjectMutation, useGetProjectStatsQuery, useGetProjectsQuery } =
  projectsApi;
