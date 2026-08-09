import { Box, Paper, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import type { FC } from "react";
import { useMemo, useState } from "react";

import { useGetDashboardTaskAnalyticsQuery } from "@/entities/dashboard";

import type { AnalyticsPeriod } from "../model/types";
import styles from "./TaskAnalytics.module.scss";

const periods: AnalyticsPeriod[] = ["Daily", "Weekly", "Monthly"];

const apiPeriodMap: Record<AnalyticsPeriod, "daily" | "weekly" | "monthly"> = {
  Daily: "daily",
  Monthly: "monthly",
  Weekly: "weekly",
};

const workflowStateColors: Record<string, string> = {
  done: "#16a8ff",
  in_progress: "#5355ff",
  open: "#8e72d8",
  review: "#ff9f43",
};

const workflowStateLabels: Record<string, string> = {
  done: "Done",
  in_progress: "In progress",
  open: "Open",
  review: "Review",
};

const formatAnalyticsLabel = (label: string, period: AnalyticsPeriod): string => {
  if (period === "Daily") {
    const [year, month, day] = label.split("-");
    if (!year || !month || !day) {
      return label;
    }

    return `${day}.${month}`;
  }

  if (period === "Monthly") {
    const [year, month] = label.split("-");
    if (!year || !month) {
      return label;
    }

    return `${month}.${year.slice(-2)}`;
  }

  return label.replace("-", " / W");
};

export const TaskAnalytics: FC = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>("Monthly");
  const { data, isError, isLoading } = useGetDashboardTaskAnalyticsQuery(apiPeriodMap[period]);

  const analyticsGroups = useMemo(() => {
    const groups = new Map<string, Map<string, number>>();

    for (const item of data ?? []) {
      const labelGroup = groups.get(item._id.label) ?? new Map<string, number>();
      labelGroup.set(
        item._id.workflowState,
        (labelGroup.get(item._id.workflowState) ?? 0) + item.count,
      );
      groups.set(item._id.label, labelGroup);
    }

    return Array.from(groups.entries()).slice(-8);
  }, [data]);

  const xAxisLabels = useMemo(
    () => analyticsGroups.map(([label]) => formatAnalyticsLabel(label, period)),
    [analyticsGroups, period],
  );

  const chartSeries = useMemo(() => {
    const workflowStates = Array.from(
      new Set(
        analyticsGroups.flatMap(([, workflowStateValues]) =>
          Array.from(workflowStateValues.keys()),
        ),
      ),
    );

    return workflowStates
      .map((workflowState) => {
        const values = analyticsGroups.map(
          ([, workflowStateValues]) => workflowStateValues.get(workflowState) ?? 0,
        );

        return {
          color: workflowStateColors[workflowState] ?? "#98a2b3",
          data: values,
          label: workflowStateLabels[workflowState] ?? workflowState,
          showMark: false,
        };
      })
      .filter((series) => series.data.some((value) => value > 0));
  }, [analyticsGroups]);

  return (
    <Paper className={styles.analyticsCard} elevation={0}>
      <Box className={styles.analyticsHeader}>
        <Typography component="h2">Task analytics</Typography>

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

      {chartSeries.length > 0 && (
        <Box className={styles.legend}>
          {chartSeries.map((item) => (
            <Box key={item.label} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <Typography>{item.label}</Typography>
            </Box>
          ))}
        </Box>
      )}

      {isError && <Typography className={styles.chartState}>Unable to load analytics.</Typography>}
      {isLoading && <Typography className={styles.chartState}>Loading analytics...</Typography>}

      {!isLoading && !isError && (
        <Box className={styles.chartContainer}>
          {chartSeries.length === 0 || xAxisLabels.length === 0 ? (
            <Box className={styles.chartEmptyState}>
              <Typography className={styles.chartState}>
                No analytics yet for this period.
              </Typography>
            </Box>
          ) : (
            <LineChart
              className={styles.chart}
              height={320}
              margin={{ bottom: 30, left: 40, right: 20, top: 20 }}
              series={chartSeries}
              xAxis={[
                {
                  data: xAxisLabels,
                  scaleType: "point",
                },
              ]}
              yAxis={[
                {
                  min: 0,
                },
              ]}
              grid={{ horizontal: true }}
            />
          )}
        </Box>
      )}
    </Paper>
  );
};
