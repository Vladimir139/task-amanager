import { CheckBoxOutlined, DescriptionOutlined, StarBorder } from "@mui/icons-material";
import { Box, Paper, Typography } from "@mui/material";
import type { FC } from "react";

import type { StatisticsCardProps } from "@/entities/statistic/model/types.ts";
import { MiniChart } from "@/shared/ui/atoms";

import styles from "./StatisticCard.module.scss";

const statisticIcons = {
  completed: StarBorder,
  "new-task": DescriptionOutlined,
  "project-done": CheckBoxOutlined,
};

export const StatisticsCard: FC<StatisticsCardProps> = ({ statistic }) => {
  const Icon = statisticIcons[statistic.id as keyof typeof statisticIcons];

  return (
    <Paper className={styles.statisticCard} elevation={0}>
      <Box className={styles.statisticHeader}>
        <Box className={styles.statisticTitle}>
          <Box className={styles.statisticIcon}>
            <Icon />
          </Box>

          <Typography>{statistic.title}</Typography>
        </Box>

        <Typography className={styles.statisticValue}>{statistic.value}</Typography>
      </Box>

      <Box className={styles.statisticDivider} />

      <Box className={styles.statisticContent}>
        <MiniChart color={statistic.color} />

        <Box className={styles.statisticDescription}>
          <Typography>
            <strong>{statistic.increase}</strong> more
          </Typography>

          <Typography>from last week</Typography>
        </Box>
      </Box>
    </Paper>
  );
};
