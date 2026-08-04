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
  members: string[];
}

export interface BoardColumn {
  id: string;
  title: string;
  tasks: BoardTask[];
}

export interface ChatMessage {
  id: number;
  author: string;
  avatar: string;
  text?: string;
  time: string;
  isOwn?: boolean;
  audio?: boolean;
}
