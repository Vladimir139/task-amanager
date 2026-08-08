import { baseApi } from "@/shared/api";
import type { ProjectMemberRecord } from "@/shared/api/types";

export interface AddProjectMemberPayload {
  projectId: string;
  role: "admin" | "member" | "viewer";
  userId: string;
}

export interface UpdateProjectMemberRolePayload {
  memberUserId: string;
  projectId: string;
  role: "admin" | "member" | "viewer";
}

export interface RemoveProjectMemberPayload {
  memberUserId: string;
  projectId: string;
}

export const projectMembersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addProjectMember: build.mutation<ProjectMemberRecord, AddProjectMemberPayload>({
      invalidatesTags: (_result, _error, payload) => [
        "Projects",
        { id: payload.projectId, type: "ProjectMembers" },
        { id: payload.projectId, type: "Projects" },
      ],
      query: ({ projectId, ...body }) => ({
        body,
        method: "POST",
        url: `/projects/${projectId}/members`,
      }),
    }),
    removeProjectMember: build.mutation<ProjectMemberRecord, RemoveProjectMemberPayload>({
      invalidatesTags: (_result, _error, payload) => [
        "Projects",
        { id: payload.projectId, type: "ProjectMembers" },
        { id: payload.projectId, type: "Projects" },
      ],
      query: ({ memberUserId, projectId }) => ({
        method: "DELETE",
        url: `/projects/${projectId}/members/${memberUserId}`,
      }),
    }),
    updateProjectMemberRole: build.mutation<ProjectMemberRecord, UpdateProjectMemberRolePayload>({
      invalidatesTags: (_result, _error, payload) => [
        "Projects",
        { id: payload.projectId, type: "ProjectMembers" },
        { id: payload.projectId, type: "Projects" },
      ],
      query: ({ memberUserId, projectId, role }) => ({
        body: { role },
        method: "PATCH",
        url: `/projects/${projectId}/members/${memberUserId}`,
      }),
    }),
  }),
});

export const {
  useAddProjectMemberMutation,
  useRemoveProjectMemberMutation,
  useUpdateProjectMemberRoleMutation,
} = projectMembersApi;
