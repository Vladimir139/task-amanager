import { baseApi } from "@/shared/api";
import type { ProjectListResponse, ProjectRecord, ProjectStatsResponse } from "@/shared/api/types";

export interface GetProjectsQuery {
  limit?: number;
  page?: number;
  search?: string;
  sort?: string;
  status?: string;
}

const removeEmpty = (value: GetProjectsQuery) =>
  Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== ""));

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProjectById: build.query<ProjectRecord, string>({
      providesTags: (_result, _error, projectId) => [{ id: projectId, type: "Projects" }],
      query: (projectId) => `/projects/${projectId}`,
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

export const { useGetProjectByIdQuery, useGetProjectStatsQuery, useGetProjectsQuery } = projectsApi;
