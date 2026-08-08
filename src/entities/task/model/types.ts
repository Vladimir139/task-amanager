export interface Task {
  id: string | number;
  time: string;
  title: string;
  url: string;
  comments: number;
  progress: number;
}

export interface TaskCardProps {
  onOpen?: () => void;
  task: Task;
}
