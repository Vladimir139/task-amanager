import type { ProjectStatistic } from "@/entities/projectStatistic";

export const projectStatistics: ProjectStatistic[] = [
  {
    id: "total",
    title: "Total Projects",
    value: 12,
    difference: "+2 this month",
    type: "total",
  },
  {
    id: "progress",
    title: "In Progress",
    value: 7,
    difference: "58% of projects",
    type: "progress",
  },
  {
    id: "completed",
    title: "Completed",
    value: 4,
    difference: "+1 this week",
    type: "completed",
  },
  {
    id: "overdue",
    title: "Overdue",
    value: 1,
    difference: "Needs attention",
    type: "overdue",
  },
];
