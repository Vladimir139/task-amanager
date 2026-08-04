import type { BoardMember } from "@/entities/boardMember";

export type TaskCategory = "Design" | "Research" | "Planning" | "Content";

export interface BoardTask {
  id: number;
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
  task: BoardTask;
}
