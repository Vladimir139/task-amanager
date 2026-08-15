import {
  CheckCircleOutlined,
  DashboardOutlined,
  TimelapseOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import { Box, Paper, Typography } from "@mui/material";
import type { FC } from "react";

import type { ProjectStatistic, ProjectStatisticCardProps } from "../model/types";
import styles from "./ProjectStatisticCard.module.scss";

const statisticIcons = {
  total: DashboardOutlined,
  progress: TimelapseOutlined,
  completed: CheckCircleOutlined,
  overdue: WarningAmberOutlined,
} satisfies Record<ProjectStatistic["type"], typeof DashboardOutlined>;

const statisticClassNames: Record<ProjectStatistic["type"], string> = {
  total: styles.totalStatistic,
  progress: styles.progressStatistic,
  completed: styles.completedStatistic,
  overdue: styles.overdueStatistic,
};

export const ProjectStatisticCard: FC<ProjectStatisticCardProps> = ({ statistic }) => {
  const Icon = statisticIcons[statistic.type];

  return (
    <Paper className={styles.statisticCard} elevation={0}>
      <Box className={`${styles.statisticIcon} ${statisticClassNames[statistic.type]}`}>
        <Icon />
      </Box>

      <Box className={styles.statisticContent}>
        <Typography>{statistic.title}</Typography>

        <Box>
          <Typography component="strong">{statistic.value}</Typography>

          <Typography>{statistic.difference}</Typography>
        </Box>
      </Box>
    </Paper>
  );
};
