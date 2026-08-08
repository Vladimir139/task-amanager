export type ActivityType = "media" | "photos" | "docs";

export interface ActivityItem {
  id: string | number;
  value: number;
  type: ActivityType;
}
