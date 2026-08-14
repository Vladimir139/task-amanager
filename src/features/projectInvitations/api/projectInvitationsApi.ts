import { baseApi } from "@/shared/api";
import type { ProjectInvitationRecord } from "@/shared/api/types";

export interface InviteProjectMemberPayload {
  projectId: string;
  email: string;
  role: "admin" | "member" | "viewer";
}

export interface RespondToProjectInvitationPayload {
  invitationId: string;
}

export const projectInvitationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    acceptProjectInvitation: build.mutation<
      ProjectInvitationRecord,
      RespondToProjectInvitationPayload
    >({
      invalidatesTags: (result) =>
        result
          ? [
              "Projects",
              "ProjectStats",
              { id: "received", type: "ProjectInvitations" },
              { id: result.projectId, type: "ProjectInvitations" },
              { id: result.projectId, type: "ProjectMembers" },
              { id: result.projectId, type: "Projects" },
            ]
          : ["Projects", "ProjectStats", { id: "received", type: "ProjectInvitations" }],
      query: ({ invitationId }) => ({
        method: "POST",
        url: `/projects/invitations/${invitationId}/accept`,
      }),
    }),
    declineProjectInvitation: build.mutation<
      ProjectInvitationRecord,
      RespondToProjectInvitationPayload
    >({
      invalidatesTags: (result) =>
        result
          ? [
              { id: "received", type: "ProjectInvitations" },
              { id: result.projectId, type: "ProjectInvitations" },
            ]
          : [{ id: "received", type: "ProjectInvitations" }],
      query: ({ invitationId }) => ({
        method: "POST",
        url: `/projects/invitations/${invitationId}/decline`,
      }),
    }),
    inviteProjectMember: build.mutation<ProjectInvitationRecord, InviteProjectMemberPayload>({
      invalidatesTags: (_result, _error, payload) => [
        { id: payload.projectId, type: "ProjectInvitations" },
        { id: "received", type: "ProjectInvitations" },
      ],
      query: ({ projectId, ...body }) => ({
        body,
        method: "POST",
        url: `/projects/${projectId}/invitations`,
      }),
    }),
  }),
});

export const {
  useAcceptProjectInvitationMutation,
  useDeclineProjectInvitationMutation,
  useInviteProjectMemberMutation,
} = projectInvitationsApi;
