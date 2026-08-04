import { Box, Paper, Typography } from "@mui/material";
import type { FC } from "react";
import { useState } from "react";

import type { AnalyticsPeriod } from "../model/types";
import styles from "./TaskAnalytics.module.scss";

const periods: AnalyticsPeriod[] = ["Daily", "Weekly", "Monthly"];

export const TaskAnalytics: FC = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>("Monthly");

  return (
    <Paper className={styles.analyticsCard} elevation={0}>
      <Box className={styles.analyticsHeader}>
        <Typography component="h2">Task Done</Typography>

        <Box className={styles.periodNavigation}>
          {periods.map((item) => (
            <button
              key={item}
              type="button"
              className={period === item ? styles.activePeriod : undefined}
              onClick={() => {
                setPeriod(item);
              }}
            >
              {item}
            </button>
          ))}
        </Box>
      </Box>

      <img
        src="/images/main-chart.png"
        alt={`Task statistics for ${period.toLowerCase()} period`}
        className={styles.mainChart}
      />
    </Paper>
  );
};
