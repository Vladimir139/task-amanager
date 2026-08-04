import { Box } from "@mui/material";
import type { FC } from "react";

import { StatisticCard } from "@/entities/statistic/ui";

import { statistics } from "../model/statistics.data";
import styles from "./DashboardStatistics.module.scss";

export const DashboardStatistics: FC = () => {
  return (
    <Box className={styles.statistics}>
      {statistics.map((statistic) => (
        <StatisticCard key={statistic.id} statistic={statistic} />
      ))}
    </Box>
  );
};
