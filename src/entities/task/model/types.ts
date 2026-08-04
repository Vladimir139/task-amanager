export interface Task {
  id: number;
  time: string;
  title: string;
  url: string;
  comments: number;
  progress: number;
}

export interface TaskCardProps {
  task: Task;
}
