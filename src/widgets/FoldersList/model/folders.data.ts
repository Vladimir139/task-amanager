import type { Folder } from "@/entities/folder";

export const folders: Folder[] = [
  {
    id: 1,
    name: "Documents",
    filesCount: 24,
    color: "blue",
    members: ["A", "B"],
  },
  {
    id: 2,
    name: "Music",
    filesCount: 102,
    color: "purple",
  },
  {
    id: 3,
    name: "Work Project",
    filesCount: 84,
    color: "blue",
    members: ["A", "B"],
  },
  {
    id: 4,
    name: "Personal Media",
    filesCount: 2450,
    color: "yellow",
    members: ["A"],
  },
  {
    id: 5,
    name: "Redding Backup",
    filesCount: 22,
    color: "green",
  },
  {
    id: 6,
    name: "Root",
    filesCount: 105,
    color: "red",
    members: ["B"],
  },
];
