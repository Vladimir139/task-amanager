import { Box, Paper, Typography } from "@mui/material";
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

  const chartData = useMemo(() => {
    const groups = new Map<string, Map<string, number>>();

    for (const item of data ?? []) {
      const labelGroup = groups.get(item._id.label) ?? new Map<string, number>();
      labelGroup.set(
        item._id.workflowState,
        (labelGroup.get(item._id.workflowState) ?? 0) + item.count,
      );
      groups.set(item._id.label, labelGroup);
    }

    return Array.from(groups.entries())
      .slice(-8)
      .map(([label, workflowStates]) => {
        const segments = Array.from(workflowStates.entries()).map(([workflowState, value]) => ({
          color: workflowStateColors[workflowState] ?? "#98a2b3",
          label: workflowStateLabels[workflowState] ?? workflowState,
          value,
          workflowState,
        }));
        const total = segments.reduce((sum, segment) => sum + segment.value, 0);

        return {
          displayLabel: formatAnalyticsLabel(label, period),
          label,
          segments,
          total,
        };
      });
  }, [data, period]);

  const maxValue = Math.max(...chartData.map((item) => item.total), 1);
  const legendItems = useMemo(
    () =>
      Array.from(
        new Map(
          chartData
            .flatMap((item) => item.segments)
            .map((segment) => [segment.workflowState, segment]),
        ).values(),
      ),
    [chartData],
  );

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

      {legendItems.length > 0 && (
        <Box className={styles.legend}>
          {legendItems.map((item) => (
            <Box key={item.workflowState} className={styles.legendItem}>
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
        <Box className={styles.chart}>
          {chartData.length === 0 ? (
            <Typography className={styles.chartState}>No analytics yet for this period.</Typography>
          ) : (
            chartData.map((item) => (
              <Box key={item.label} className={styles.chartColumn}>
                <Box className={styles.chartBarTrack}>
                  <Box
                    className={styles.chartBarStack}
                    sx={{ height: `${(item.total / maxValue) * 100}%` }}
                  >
                    {item.segments.map((segment) => (
                      <Box
                        key={`${item.label}-${segment.workflowState}`}
                        className={styles.chartBarValue}
                        sx={{
                          backgroundColor: segment.color,
                          flex: segment.value,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
                <Typography className={styles.chartValue}>{item.total}</Typography>
                <Typography className={styles.chartLabel}>{item.displayLabel}</Typography>
              </Box>
            ))
          )}
        </Box>
      )}
    </Paper>
  );
};
