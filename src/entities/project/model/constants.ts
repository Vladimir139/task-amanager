import type { ProjectColor, ProjectStatus } from "./types";

export const projectStatusOptions: Array<{ label: string; value: ProjectStatus }> = [
  { label: "In Progress", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "On Hold", value: "on-hold" },
  { label: "Archived", value: "archived" },
];

export const projectColorOptions: Array<{ label: string; value: ProjectColor }> = [
  { label: "Purple", value: "purple" },
  { label: "Blue", value: "blue" },
  { label: "Orange", value: "orange" },
  { label: "Green", value: "green" },
  { label: "Red", value: "red" },
  { label: "Gray", value: "gray" },
];

export const projectMemberRoleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Member", value: "member" },
  { label: "Viewer", value: "viewer" },
] as const;
