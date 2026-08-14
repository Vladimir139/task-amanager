export interface Task {
  assigneeCount: number;
  checklistCompleted: number;
  checklistTotal: number;
  comments: number;
  description: string;
  dueDate: string;
  id: string | number;
  startDate: string;
  title: string;
  watcherCount: number;
}

export interface TaskCardProps {
  onOpen?: () => void;
  task: Task;
}
