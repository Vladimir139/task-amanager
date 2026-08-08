export type FileType =
  | "document"
  | "image"
  | "figma"
  | "illustrator"
  | "audio"
  | "video"
  | "sketch"
  | "xd"
  | "svg"
  | "other";

export interface RecentFile {
  id: string | number;
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
