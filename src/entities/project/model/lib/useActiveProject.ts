import { useSearchParams } from "react-router-dom";

import { useAppSelector } from "@/shared/libs/redux";

import { useGetProjectByIdQuery, useGetProjectsQuery } from "../../api/projectsApi";
import { selectCurrentProjectId } from "../selectors/projectSelectionSelectors";

interface UseActiveProjectResult {
  activeProjectId: string | null;
  currentProjectTitle: string | null;
  isError: boolean;
  isLoading: boolean;
}

export const useActiveProject = (): UseActiveProjectResult => {
  const [searchParams] = useSearchParams();
  const projectIdFromQuery = searchParams.get("projectId");
  const currentProjectId = useAppSelector(selectCurrentProjectId);
  const resolvedProjectId = projectIdFromQuery ?? currentProjectId;

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
      skip: Boolean(resolvedProjectId),
    },
  );

  const {
    data: selectedProject,
    isError: isSelectedProjectError,
    isLoading: isSelectedProjectLoading,
  } = useGetProjectByIdQuery(resolvedProjectId ?? "", {
    skip: !resolvedProjectId,
  });

  const fallbackProject = fallbackProjects?.items[0];

  return {
    activeProjectId: resolvedProjectId ?? fallbackProject?._id ?? null,
    currentProjectTitle: selectedProject?.title ?? fallbackProject?.title ?? null,
    isError: isFallbackProjectsError || isSelectedProjectError,
    isLoading: isFallbackProjectsLoading || isSelectedProjectLoading,
  };
};
