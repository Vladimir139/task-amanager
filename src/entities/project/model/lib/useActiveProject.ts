import { useSearchParams } from "react-router-dom";

import { useGetProjectByIdQuery, useGetProjectsQuery } from "../../api/projectsApi";

interface UseActiveProjectResult {
  activeProjectId: string | null;
  currentProjectTitle: string | null;
  isError: boolean;
  isLoading: boolean;
}

export const useActiveProject = (): UseActiveProjectResult => {
  const [searchParams] = useSearchParams();
  const projectIdFromQuery = searchParams.get("projectId");

  const {
    data: fallbackProjects,
    isError: isFallbackProjectsError,
    isLoading: isFallbackProjectsLoading,
  } = useGetProjectsQuery(
    {
      limit: 1,
      page: 1,
    },
    {
      skip: Boolean(projectIdFromQuery),
    },
  );

  const {
    data: selectedProject,
    isError: isSelectedProjectError,
    isLoading: isSelectedProjectLoading,
  } = useGetProjectByIdQuery(projectIdFromQuery ?? "", {
    skip: !projectIdFromQuery,
  });

  const fallbackProject = fallbackProjects?.items[0];

  return {
    activeProjectId: projectIdFromQuery ?? fallbackProject?._id ?? null,
    currentProjectTitle: selectedProject?.title ?? fallbackProject?.title ?? null,
    isError: isFallbackProjectsError || isSelectedProjectError,
    isLoading: isFallbackProjectsLoading || isSelectedProjectLoading,
  };
};
