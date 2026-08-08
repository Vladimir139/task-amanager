import type { FolderColor } from "../types";

export const folderColors: FolderColor[] = ["blue", "purple", "yellow", "green", "red"];

export const mapFolderColor = (color?: string | null): FolderColor =>
  folderColors.includes((color ?? "") as FolderColor) ? (color as FolderColor) : "blue";
