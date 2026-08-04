export type StatisticId = "completed" | "new-task" | "project-done";

export type StatisticChartColor = "purple" | "blue" | "red";

export interface Statistic {
  id: StatisticId;
  title: string;
  value: string;
  increase: string;
  color: StatisticChartColor;
}

export interface StatisticCardProps {
  statistic: Statistic;
}
