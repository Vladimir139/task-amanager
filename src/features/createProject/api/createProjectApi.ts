import { baseApi } from "@/shared/api";
import type { ProjectRecord } from "@/shared/api/types";

export interface CreateProjectPayload {
  color?: string;
  description?: string;
  dueDate?: string;
  startDate?: string;
  status?: string;
  title: string;
}

export const createProjectApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createProject: build.mutation<ProjectRecord, CreateProjectPayload>({
      invalidatesTags: ["Projects", "ProjectStats", "Board"],
      query: (body) => ({
        body,
        method: "POST",
        url: "/projects",
      }),
    }),
  }),
});

export const { useCreateProjectMutation } = createProjectApi;
