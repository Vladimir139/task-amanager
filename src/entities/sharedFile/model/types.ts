export type SharedFileType = "figma" | "sketch" | "xd" | "svg";

export interface SharedFile {
  id: number;
  name: string;
  information: string;
  type: SharedFileType;
}

export interface SharedFileItemProps {
  file: SharedFile;
}
