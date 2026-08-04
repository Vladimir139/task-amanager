export interface StatisticItem {
  id: string;
  title: string;
  value: string;
  increase: string;
  color: "purple" | "blue" | "red";
}

export interface MessageItem {
  id: number;
  name: string;
  message: string;
  avatar: string;
  color: string;
}

export interface TaskItem {
  id: number;
  time: string;
  title: string;
  url: string;
  comments: number;
  progress: number;
}
