export type StorageType = "media" | "documents" | "music" | "other";

export interface StorageItem {
  id: number;
  title: string;
  value: string;
  percentage: number;
  type: StorageType;
}

export interface StorageItemRowProps {
  item: StorageItem;
}
