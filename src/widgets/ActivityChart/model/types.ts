export type ActivityType = "media" | "photos" | "docs";

export interface ActivityItem {
  id: number;
  value: number;
  type: ActivityType;
}
