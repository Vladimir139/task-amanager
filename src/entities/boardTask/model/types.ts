import type { BoardMember } from "@/entities/boardMember";

export type TaskCategory = "Design" | "Research" | "Planning" | "Content" | "Development" | "Other";

export interface BoardTask {
  id: string | number;
  title: string;
  description: string;
  category: TaskCategory;
  date: string;
  image?: string;
  comments?: number;
  files?: number;
  completed?: number;
  total?: number;
  members: BoardMember[];
}

export interface BoardColumn {
  id: string;
  title: string;
  tasks: BoardTask[];
}

export interface BoardTaskCardProps {
  onClick?: () => void;
  task: BoardTask;
}
