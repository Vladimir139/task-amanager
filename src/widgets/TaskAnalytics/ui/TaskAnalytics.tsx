import { Box, Paper, Typography } from "@mui/material";
import type { FC } from "react";
import { useMemo, useState } from "react";

import { useGetDashboardTaskAnalyticsQuery } from "@/entities/dashboard/api/dashboardApi";

import type { AnalyticsPeriod } from "../model/types";
import styles from "./TaskAnalytics.module.scss";

const periods: AnalyticsPeriod[] = ["Daily", "Weekly", "Monthly"];

const apiPeriodMap: Record<AnalyticsPeriod, "daily" | "weekly" | "monthly"> = {
  Daily: "daily",
  Monthly: "monthly",
  Weekly: "weekly",
};

export const TaskAnalytics: FC = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>("Monthly");
  const { data, isError, isLoading } = useGetDashboardTaskAnalyticsQuery(apiPeriodMap[period]);

  const chartData = useMemo(() => {
    const groups = new Map<string, number>();

    for (const item of data ?? []) {
      groups.set(item._id.label, (groups.get(item._id.label) ?? 0) + item.count);
    }

    return Array.from(groups.entries())
      .slice(-8)
      .map(([label, value]) => ({ label, value }));
  }, [data]);

  const maxValue = Math.max(...chartData.map((item) => item.value), 1);

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

      {isError && <Typography className={styles.chartState}>Unable to load analytics.</Typography>}
      {isLoading && <Typography className={styles.chartState}>Loading analytics...</Typography>}

      {!isLoading && !isError && (
        <Box className={styles.chart}>
          {chartData.length === 0 ? (
            <Typography className={styles.chartState}>No analytics yet for this period.</Typography>
          ) : (
            chartData.map((item) => (
              <Box key={item.label} className={styles.chartColumn}>
                <Box className={styles.chartBarTrack}>
                  <Box
                    className={styles.chartBarValue}
                    sx={{ height: `${(item.value / maxValue) * 100}%` }}
                  />
                </Box>
                <Typography className={styles.chartValue}>{item.value}</Typography>
                <Typography className={styles.chartLabel}>{item.label}</Typography>
              </Box>
            ))
          )}
        </Box>
      )}
    </Paper>
  );
};
