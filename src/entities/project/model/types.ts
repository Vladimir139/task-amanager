export type ProjectStatus = "active" | "completed" | "on-hold" | "archived";

export type ProjectColor = "purple" | "blue" | "orange" | "green" | "red" | "gray";

export type ProjectViewMode = "grid" | "list";

export interface ProjectMember {
  avatarUrl?: string;
  id: string | number;
  name: string;
  initials: string;
  role?: string;
}

export interface Project {
  id: string | number;
  title: string;
  description: string;
  status: ProjectStatus;
  color: ProjectColor;
  memberCount: number;
  tasksCompleted: number;
  tasksTotal: number;
  dueDate: string;
  members: ProjectMember[];
}

export interface ProjectCardProps {
  isSelected?: boolean;
  onManage?: (project: Project) => void;
  project: Project;
  viewMode?: ProjectViewMode;
  onOpen?: (project: Project) => void;
}
