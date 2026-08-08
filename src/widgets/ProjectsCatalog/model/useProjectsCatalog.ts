import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Project } from "@/entities/project";
import { useGetProjectsQuery } from "@/entities/project";
import { useGetUsersQuery } from "@/entities/user";
import { getTasksRoute } from "@/shared/config/router";
import { formatDateLabel, getInitials } from "@/shared/lib/formatters";

import type { ProjectFilter, ProjectSort, ViewMode } from "./types";

const mapProjectStatus = (status: string): Project["status"] => {
  if (status === "completed") {
    return "completed";
  }

  if (status === "on-hold" || status === "archived") {
    return "on-hold";
  }

  return "active";
};

const mapProjectColor = (color: string): Project["color"] => {
  if (["purple", "blue", "orange", "green", "red"].includes(color)) {
    return color as Project["color"];
  }

  return "blue";
};

interface UseProjectsCatalogResult {
  handleOpenProject: (project: Project) => void;
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSortChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isError: boolean;
  isLoading: boolean;
  projects: Project[];
  search: string;
  setViewMode: (mode: ViewMode) => void;
  sort: ProjectSort;
  status: ProjectFilter;
  viewMode: ViewMode;
}

export const useProjectsCatalog = (): UseProjectsCatalogResult => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProjectFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sort, setSort] = useState<ProjectSort>("default");

  const { data, isError, isLoading } = useGetProjectsQuery({
    limit: 24,
    page: 1,
    search,
    sort: sort === "default" ? undefined : sort,
    status: status === "all" ? undefined : status,
  });
  const { data: users } = useGetUsersQuery();

  const projects = useMemo(() => {
    const userMap = new Map((users ?? []).map((user) => [user._id, user]));

    return (data?.items ?? []).map((project) => {
      const owner = userMap.get(project.ownerId);
      const members = Array.from({ length: Math.min(project.memberCount, 4) }, (_, index) => {
        if (owner && index === 0) {
          return {
            id: owner._id,
            initials: getInitials(owner.firstName, owner.lastName),
            name: `${owner.firstName} ${owner.lastName}`.trim(),
          };
        }

        return {
          id: `${project._id}-member-${index}`,
          initials: `M${index + 1}`,
          name: `Member ${index + 1}`,
        };
      });

      return {
        color: mapProjectColor(project.color),
        description: project.description || "No description yet",
        dueDate: formatDateLabel(project.dueDate),
        id: project._id,
        members,
        progress: project.progressPercent,
        status: mapProjectStatus(project.status),
        tasksCompleted: project.completedTaskCount,
        tasksTotal: Math.max(project.taskCount, project.completedTaskCount, 1),
        title: project.title,
      } satisfies Project;
    });
  }, [data?.items, users]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearch(event.target.value);
  };

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setStatus(event.target.value as ProjectFilter);
  };

  const handleSortChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSort(event.target.value as ProjectSort);
  };

  const handleOpenProject = (project: Project): void => {
    void navigate(getTasksRoute(String(project.id)));
  };

  return {
    handleOpenProject,
    handleSearchChange,
    handleSortChange,
    handleStatusChange,
    isError,
    isLoading,
    projects,
    search,
    setViewMode,
    sort,
    status,
    viewMode,
  };
};
