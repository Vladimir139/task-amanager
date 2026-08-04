import type { ProjectStatus, ProjectViewMode } from "@/entities/project";

export type ProjectFilter = "all" | ProjectStatus;

export type ProjectSort = "default" | "title" | "progress-asc" | "progress-desc" | "due-date";

export interface ProjectFilterItem {
  value: ProjectFilter;
  label: string;
}

export type ViewMode = ProjectViewMode;
