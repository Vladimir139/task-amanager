import { baseApi } from "@/shared/api";
import type { ProjectRecord } from "@/shared/api/types";

export interface UpdateProjectPayload {
  color?: string;
  description?: string;
  dueDate?: string;
  projectId: string;
  startDate?: string;
  status?: string;
  title: string;
}

export const updateProjectApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateProject: build.mutation<ProjectRecord, UpdateProjectPayload>({
      invalidatesTags: (_result, _error, payload) => [
        "Projects",
        "ProjectStats",
        { id: payload.projectId, type: "Projects" },
        { id: payload.projectId, type: "ProjectMembers" },
      ],
      query: ({ projectId, ...body }) => ({
        body,
        method: "PATCH",
        url: `/projects/${projectId}`,
      }),
    }),
  }),
});

export const { useUpdateProjectMutation } = updateProjectApi;
