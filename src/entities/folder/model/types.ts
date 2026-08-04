export type FolderColor = "blue" | "purple" | "yellow" | "green" | "red";

export interface Folder {
  id: number;
  name: string;
  filesCount: number;
  color: FolderColor;
  members?: string[];
}

export interface FolderCardProps {
  folder: Folder;
  onClick?: (folder: Folder) => void;
}
