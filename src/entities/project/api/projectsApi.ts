import { baseApi } from "@/shared/api";
import type {
  ProjectInvitationRecord,
  ProjectListResponse,
  ProjectMemberRecord,
  ProjectRecord,
  ProjectStatsResponse,
} from "@/shared/api/types";

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
    getProjectInvitations: build.query<ProjectInvitationRecord[], string>({
      providesTags: (_result, _error, projectId) => [{ id: projectId, type: "ProjectInvitations" }],
      query: (projectId) => `/projects/${projectId}/invitations`,
    }),
    getProjectMembers: build.query<ProjectMemberRecord[], string>({
      providesTags: (_result, _error, projectId) => [{ id: projectId, type: "ProjectMembers" }],
      query: (projectId) => `/projects/${projectId}/members`,
    }),
    getReceivedProjectInvitations: build.query<ProjectInvitationRecord[], void>({
      providesTags: [{ id: "received", type: "ProjectInvitations" }],
      query: () => "/projects/invitations/received",
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

export const {
  useGetProjectByIdQuery,
  useGetProjectInvitationsQuery,
  useGetProjectMembersQuery,
  useGetReceivedProjectInvitationsQuery,
  useGetProjectStatsQuery,
  useGetProjectsQuery,
} = projectsApi;
