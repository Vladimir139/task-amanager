import type { ActivityItem, FolderItem, RecentFile, StorageItem } from "./files.types.ts";

export const folders: FolderItem[] = [
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

export const recentFiles: RecentFile[] = [
  {
    id: 1,
    name: "Proposal.docx",
    size: "2.9 MB",
    lastModified: "Feb 25,2022",
    type: "document",
    members: ["KJ", "CM", "AM", "NW", "AD"],
  },
  {
    id: 2,
    name: "Background.jpg",
    size: "3.5 MB",
    lastModified: "Feb 24,2022",
    type: "image",
    members: ["KJ", "CM", "AM"],
  },
  {
    id: 3,
    name: "Apex website.fig",
    size: "23.5 MB",
    lastModified: "Feb 22,2022",
    type: "figma",
    members: ["KJ", "CM", "AM", "NW", "AD"],
  },
  {
    id: 4,
    name: "Illustration.ai",
    size: "7.2 MB",
    lastModified: "Feb 20,2022",
    type: "illustrator",
    members: ["AM", "NW", "AD"],
  },
];

export const storageItems: StorageItem[] = [
  {
    id: 1,
    title: "Media",
    value: "86 GB",
    percentage: 73,
    type: "media",
  },
  {
    id: 2,
    title: "Documents",
    value: "26 GB",
    percentage: 32,
    type: "documents",
  },
  {
    id: 3,
    title: "Music",
    value: "10 GB",
    percentage: 8,
    type: "music",
  },
  {
    id: 4,
    title: "Other File",
    value: "18 GB",
    percentage: 14,
    type: "other",
  },
];

export const activityItems: ActivityItem[] = [
  {
    id: 1,
    value: 28,
    type: "docs",
  },
  {
    id: 2,
    value: 68,
    type: "photos",
  },
  {
    id: 3,
    value: 44,
    type: "media",
  },
  {
    id: 4,
    value: 73,
    type: "docs",
  },
  {
    id: 5,
    value: 57,
    type: "media",
  },
  {
    id: 6,
    value: 64,
    type: "photos",
  },
];
