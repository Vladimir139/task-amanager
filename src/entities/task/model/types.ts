export interface Task {
  assigneeCount: number;
  checklistCompleted: number;
  checklistTotal: number;
  comments: number;
  description: string;
  dueDate: string;
  id: string | number;
  isCompleted?: boolean;
  onToggleCompleted?: () => void;
  startDate: string;
  title: string;
  watcherCount: number;
}

export interface TaskCardProps {
  onOpen?: () => void;
  task: Task;
}
