export type ProjectStatisticType = "total" | "progress" | "completed" | "overdue";

export interface ProjectStatistic {
  id: string;
  title: string;
  value: number;
  difference: string;
  type: ProjectStatisticType;
}

export interface ProjectStatisticCardProps {
  statistic: ProjectStatistic;
}
