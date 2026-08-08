import { Box, Typography } from "@mui/material";
import type { FC } from "react";

import { useGetProjectStatsQuery } from "@/entities/project";
import { type ProjectStatistic, ProjectStatisticCard } from "@/entities/projectStatistic";

import styles from "./ProjectStatistics.module.scss";

export const ProjectStatistics: FC = () => {
  const { data, isError, isLoading } = useGetProjectStatsQuery();

  const statistics: ProjectStatistic[] = [
    {
      difference: "Workspace total",
      id: "total",
      title: "Total Projects",
      type: "total",
      value: data?.total ?? 0,
    },
    {
      difference: "Active execution",
      id: "progress",
      title: "In Progress",
      type: "progress",
      value: data?.progress ?? 0,
    },
    {
      difference: "Closed successfully",
      id: "completed",
      title: "Completed",
      type: "completed",
      value: data?.completed ?? 0,
    },
    {
      difference: "Needs attention",
      id: "overdue",
      title: "Overdue",
      type: "overdue",
      value: data?.overdue ?? 0,
    },
  ];

  if (isError) {
    return <Typography>Unable to load project statistics.</Typography>;
  }

  return (
    <Box className={styles.statistics}>
      {statistics.map((statistic) => (
        <ProjectStatisticCard key={statistic.id} statistic={statistic} />
      ))}
      {isLoading && <Typography>Loading project statistics...</Typography>}
    </Box>
  );
};
