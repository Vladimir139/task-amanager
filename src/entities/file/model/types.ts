export type FileType = "document" | "image" | "figma" | "illustrator";

export interface RecentFile {
  id: number;
  name: string;
  size: string;
  lastModified: string;
  type: FileType;
  members: string[];
}

export interface FileIconProps {
  type: FileType;
}

export interface RecentFileRowProps {
  file: RecentFile;
}
