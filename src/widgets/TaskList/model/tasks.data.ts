import type { Task } from "@/entities/task";

export const tasks: Task[] = [
  {
    assigneeCount: 3,
    checklistCompleted: 2,
    checklistTotal: 6,
    comments: 8,
    description: "Search inspiration references and prepare the first draft notes.",
    dueDate: "Oct 24, 2026",
    id: 1,
    startDate: "Oct 12, 2026",
    title: "Search Inspiration for project",
    watcherCount: 4,
  },
  {
    assigneeCount: 2,
    checklistCompleted: 4,
    checklistTotal: 5,
    comments: 5,
    description: "Review moodboards, validate scope, and confirm the final direction.",
    dueDate: "Oct 30, 2026",
    id: 2,
    startDate: "Oct 18, 2026",
    title: "Search Inspiration for project",
    watcherCount: 2,
  },
];
