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
  folderName?: string | null;
  id: string | number;
  isDeleting?: boolean;
  locationLabel?: string;
  name: string;
  onDelete?: () => void;
  openUrl?: string;
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
