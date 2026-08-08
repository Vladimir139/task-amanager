export type FolderColor = "blue" | "purple" | "yellow" | "green" | "red";

export interface Folder {
  id: string | number;
  name: string;
  filesCount: number;
  color: FolderColor;
  members?: string[];
  parentId?: string | null;
  projectId?: string | null;
}

export interface FolderCardProps {
  folder: Folder;
  isActive?: boolean;
  onClick?: (folder: Folder) => void;
}
