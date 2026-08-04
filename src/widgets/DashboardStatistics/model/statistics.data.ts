import type { Statistic } from "@/entities/statistic";

export const statistics: Statistic[] = [
  {
    id: "completed",
    title: "Task Completed",
    value: "08",
    increase: "10+",
    color: "purple",
  },
  {
    id: "new-task",
    title: "New Task",
    value: "10",
    increase: "10+",
    color: "blue",
  },
  {
    id: "project-done",
    title: "Project Done",
    value: "10",
    increase: "08+",
    color: "red",
  },
];
