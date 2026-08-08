import { Box, Paper, Typography } from "@mui/material";
import type { FC } from "react";
import { useMemo } from "react";

import { useGetFileActivityQuery } from "@/entities/file";

import type { ActivityItem, ActivityType } from "../model/types";
import styles from "./ActivityChart.module.scss";

const activityClassNames: Record<ActivityType, string> = {
  docs: styles.docsBar,
  media: styles.mediaBar,
  photos: styles.photosBar,
};

const mapActivityType = (kind: string): ActivityType => {
  if (kind === "image") {
    return "photos";
  }

  if (kind === "video") {
    return "media";
  }

  return "docs";
};

export const ActivityChart: FC = () => {
  const { data, isError, isLoading } = useGetFileActivityQuery();

  const activityItems = useMemo<ActivityItem[]>(() => {
    const groupedByDay = new Map<
      string,
      {
        dominantCount: number;
        total: number;
        type: ActivityType;
      }
    >();

    for (const item of data ?? []) {
      const type = mapActivityType(item._id.kind);
      const currentDay = groupedByDay.get(item._id.day) ?? {
        dominantCount: 0,
        total: 0,
        type,
      };

      currentDay.total += item.value;

      if (item.value >= currentDay.dominantCount) {
        currentDay.dominantCount = item.value;
        currentDay.type = type;
      }

      groupedByDay.set(item._id.day, currentDay);
    }

    const rawItems = Array.from(groupedByDay.entries()).slice(-7);
    const maxValue = Math.max(...rawItems.map(([, item]) => item.total), 1);

    return rawItems.map(([day, item]) => ({
      count: item.total,
      id: day,
      label: day.slice(5),
      type: item.type,
      value: Math.round((item.total / maxValue) * 100),
    }));
  }, [data]);

  return (
    <Paper className={styles.activityCard} elevation={0}>
      <Typography component="h2">Activity Chart</Typography>

      {isError && <Typography>Unable to load activity.</Typography>}
      {isLoading && <Typography>Loading activity...</Typography>}
      {!isLoading && !isError && activityItems.length === 0 && (
        <Typography>No file activity yet.</Typography>
      )}

      <Box className={styles.chart}>
        <Box className={styles.chartGrid}>
          <span />
          <span />
          <span />
          <span />
        </Box>

        <Box className={styles.chartBars}>
          {activityItems.map((item) => (
            <Box key={item.id} className={styles.chartColumn}>
              <Box
                className={`${styles.chartBar} ${activityClassNames[item.type]}`}
                sx={{
                  height: `${item.value}%`,
                }}
                title={`${item.count} uploads on ${item.label}`}
              />
              <Typography className={styles.chartLabel}>{item.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box className={styles.chartLegend}>
        <Box>
          <span className={styles.mediaDot} />
          Media
        </Box>

        <Box>
          <span className={styles.photosDot} />
          Photos
        </Box>

        <Box>
          <span className={styles.docsDot} />
          Docs
        </Box>
      </Box>
    </Paper>
  );
};
