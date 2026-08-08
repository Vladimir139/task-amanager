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
    const rawItems = (data ?? []).slice(-6);
    const maxValue = Math.max(...rawItems.map((item) => item.value), 1);

    return rawItems.map((item) => ({
      id: `${item._id.day}-${item._id.kind}`,
      type: mapActivityType(item._id.kind),
      value: Math.round((item.value / maxValue) * 100),
    }));
  }, [data]);

  return (
    <Paper className={styles.activityCard} elevation={0}>
      <Typography component="h2">Activity Chart</Typography>

      {isError && <Typography>Unable to load activity.</Typography>}
      {isLoading && <Typography>Loading activity...</Typography>}

      <Box className={styles.chart}>
        <Box className={styles.chartGrid}>
          <span />
          <span />
          <span />
          <span />
        </Box>

        <Box className={styles.chartBars}>
          {activityItems.map((item) => (
            <Box
              key={item.id}
              className={`${styles.chartBar} ${activityClassNames[item.type]}`}
              sx={{
                height: `${item.value}%`,
              }}
              title={`${item.type}: ${item.value}%`}
            />
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
