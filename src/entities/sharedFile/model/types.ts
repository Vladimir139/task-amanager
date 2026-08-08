export type SharedFileType =
  | "figma"
  | "sketch"
  | "xd"
  | "svg"
  | "document"
  | "image"
  | "audio"
  | "video"
  | "illustrator"
  | "other";

export interface SharedFile {
  id: string | number;
  name: string;
  information: string;
  type: SharedFileType;
}

export interface SharedFileItemProps {
  file: SharedFile;
}
