export type FolderColor = "blue" | "purple" | "yellow" | "green" | "red";

export type FileType = "document" | "image" | "figma" | "illustrator";

export interface FolderItem {
  id: number;
  name: string;
  filesCount: number;
  color: FolderColor;
  members?: string[];
}

export interface RecentFile {
  id: number;
  name: string;
  size: string;
  lastModified: string;
  type: FileType;
  members: string[];
}

export interface StorageItem {
  id: number;
  title: string;
  value: string;
  percentage: number;
  type: "media" | "documents" | "music" | "other";
}

export interface ActivityItem {
  id: number;
  value: number;
  type: "media" | "photos" | "docs";
}
