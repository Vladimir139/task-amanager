export type ProjectStatus = "active" | "completed" | "on-hold";

export type ProjectColor = "purple" | "blue" | "orange" | "green" | "red";

export type ProjectViewMode = "grid" | "list";

export interface ProjectMember {
  id: string | number;
  name: string;
  initials: string;
}

export interface Project {
  id: string | number;
  title: string;
  description: string;
  status: ProjectStatus;
  color: ProjectColor;
  progress: number;
  tasksCompleted: number;
  tasksTotal: number;
  dueDate: string;
  members: ProjectMember[];
}

export interface ProjectCardProps {
  project: Project;
  viewMode?: ProjectViewMode;
  onOpen?: (project: Project) => void;
}
