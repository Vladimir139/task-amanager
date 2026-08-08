export type ActivityType = "media" | "photos" | "docs";

export interface ActivityItem {
  id: string | number;
  count: number;
  label: string;
  value: number;
  type: ActivityType;
}
