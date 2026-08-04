import type { StorageItem } from "@/entities/storage";

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
