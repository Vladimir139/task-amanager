import { useEffect, useMemo, useRef } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

import {
  projectSelectionActions,
  selectCurrentProjectId,
  selectCurrentProjectIsHydrated,
  useGetProjectsQuery,
} from "@/entities/project";
import { useUpdateCurrentProjectMutation } from "@/entities/user";
import { getTasksRoute, ROUTES } from "@/shared/config/router";
import { useAppDispatch, useAppSelector } from "@/shared/libs/redux";

interface ProjectOption {
  id: string;
  title: string;
}

interface UseProjectSwitcherResult {
  handleProjectChange: (projectId: string) => Promise<void>;
  isDisabled: boolean;
  isLoading: boolean;
  projectOptions: ProjectOption[];
  selectedProjectId: string;
}

export const useProjectSwitcher = (): UseProjectSwitcherResult => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const currentProjectId = useAppSelector(selectCurrentProjectId);
  const isCurrentProjectHydrated = useAppSelector(selectCurrentProjectIsHydrated);
  const [updateCurrentProject, { isLoading: isSavingCurrentProject }] =
    useUpdateCurrentProjectMutation();
  const hasPersistedFallbackRef = useRef(false);

  const { data, isLoading: isProjectsLoading } = useGetProjectsQuery({
    limit: 100,
    page: 1,
  });

  const projectOptions = useMemo(
    () =>
      (data?.items ?? []).map((project) => ({
        id: project._id,
        title: project.title,
      })),
    [data?.items],
  );

  const fallbackProjectId = projectOptions[0]?.id ?? "";
  const hasSelectedProject = projectOptions.some((project) => project.id === currentProjectId);
  const effectiveProjectId = hasSelectedProject ? (currentProjectId ?? "") : fallbackProjectId;

  useEffect(() => {
    if (!isCurrentProjectHydrated || !fallbackProjectId || hasPersistedFallbackRef.current) {
      return;
    }

    if (currentProjectId && hasSelectedProject) {
      return;
    }

    hasPersistedFallbackRef.current = true;
    dispatch(projectSelectionActions.setCurrentProjectId(fallbackProjectId));

    void updateCurrentProject({ currentProjectId: fallbackProjectId })
      .unwrap()
      .catch(() => {
        hasPersistedFallbackRef.current = false;
        toast.error("Unable to save the current project preference.");
      });
  }, [
    currentProjectId,
    dispatch,
    fallbackProjectId,
    hasSelectedProject,
    isCurrentProjectHydrated,
    updateCurrentProject,
  ]);

  const handleProjectChange = async (projectId: string): Promise<void> => {
    const previousProjectId = effectiveProjectId;

    dispatch(projectSelectionActions.setCurrentProjectId(projectId));

    try {
      await updateCurrentProject({ currentProjectId: projectId }).unwrap();

      if (location.pathname.startsWith(ROUTES.tasks.page)) {
        await navigate(getTasksRoute(projectId), { replace: true });
      }
    } catch {
      dispatch(projectSelectionActions.setCurrentProjectId(previousProjectId || null));
      toast.error("Unable to switch the current project.");
    }
  };

  return {
    handleProjectChange,
    isDisabled: projectOptions.length === 0 || isSavingCurrentProject,
    isLoading: isProjectsLoading || isSavingCurrentProject,
    projectOptions,
    selectedProjectId: effectiveProjectId,
  };
};
