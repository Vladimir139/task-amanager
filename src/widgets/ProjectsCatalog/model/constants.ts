import type { ProjectFilterItem } from "./types";

export const projectFilterItems: ProjectFilterItem[] = [
  {
    value: "all",
    label: "All Projects",
  },
  {
    value: "active",
    label: "In Progress",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "on-hold",
    label: "On Hold",
  },
];
