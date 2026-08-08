import { Box, Typography } from "@mui/material";
import type { FC } from "react";

import { useGetDashboardSummaryQuery } from "@/entities/dashboard/api/dashboardApi";
import { type Statistic, StatisticCard } from "@/entities/statistic";

import styles from "./DashboardStatistics.module.scss";

export const DashboardStatistics: FC = () => {
  const { data, isError, isLoading } = useGetDashboardSummaryQuery();

  const statistics: Statistic[] = [
    {
      color: "purple",
      id: "completed",
      increase: String(data?.taskCompleted ?? 0),
      title: "Task Completed",
      value: String(data?.taskCompleted ?? 0).padStart(2, "0"),
    },
    {
      color: "blue",
      id: "new-task",
      increase: String(data?.newTask ?? 0),
      title: "New Task",
      value: String(data?.newTask ?? 0).padStart(2, "0"),
    },
    {
      color: "red",
      id: "project-done",
      increase: String(data?.projectDone ?? 0),
      title: "Project Done",
      value: String(data?.projectDone ?? 0).padStart(2, "0"),
    },
  ];

  if (isError) {
    return <Typography>Unable to load dashboard statistics.</Typography>;
  }

  return (
    <Box className={styles.statistics}>
      {statistics.map((statistic) => (
        <StatisticCard key={statistic.id} statistic={statistic} />
      ))}
      {isLoading && <Typography>Loading statistics...</Typography>}
    </Box>
  );
};
