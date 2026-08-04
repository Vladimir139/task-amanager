import type { MessageItem, StatisticItem, TaskItem } from "@/shared/lib/types";

export const statistics: StatisticItem[] = [
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

export const messages: MessageItem[] = [
  {
    id: 1,
    name: "Chris Morich",
    message: "Hi Angelina! How are You?",
    avatar: "CM",
    color: "#f59e0b",
  },
  {
    id: 2,
    name: "Charmie",
    message: "Do you need that design?",
    avatar: "CH",
    color: "#ef4444",
  },
  {
    id: 3,
    name: "Jason Mandala",
    message: "What is the price of hourly...",
    avatar: "JM",
    color: "#38bdf8",
  },
  {
    id: 4,
    name: "Charlie Chu",
    message: "Awsome design!!",
    avatar: "CC",
    color: "#f97316",
  },
];

export const tasks: TaskItem[] = [
  {
    id: 1,
    time: "9.00 am",
    title: "Search Inspiration for project",
    url: "www.uistore.com",
    comments: 8,
    progress: 24,
  },
  {
    id: 2,
    time: "3.00 am",
    title: "Search Inspiration for project",
    url: "www.uistore.org",
    comments: 5,
    progress: 60,
  },
];
