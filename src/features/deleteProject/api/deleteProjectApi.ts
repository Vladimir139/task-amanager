import { baseApi } from "@/shared/api";
import type { ProjectRecord } from "@/shared/api/types";

export const deleteProjectApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    deleteProject: build.mutation<ProjectRecord, string>({
      invalidatesTags: (_result, _error, projectId) => [
        "Projects",
        "ProjectStats",
        "Board",
        { id: projectId, type: "Projects" },
        { id: projectId, type: "ProjectMembers" },
      ],
      query: (projectId) => ({
        method: "DELETE",
        url: `/projects/${projectId}`,
      }),
    }),
  }),
});

export const { useDeleteProjectMutation } = deleteProjectApi;
