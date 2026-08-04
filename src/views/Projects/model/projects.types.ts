export type ProjectStatus = "active" | "completed" | "on-hold";

export type ProjectColor = "purple" | "blue" | "orange" | "green" | "red";

export interface ProjectMember {
  id: number;
  name: string;
  initials: string;
}

export interface Project {
  id: number;
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

export interface ProjectStatistic {
  id: string;
  title: string;
  value: number;
  difference: string;
  type: "total" | "progress" | "completed" | "overdue";
}
