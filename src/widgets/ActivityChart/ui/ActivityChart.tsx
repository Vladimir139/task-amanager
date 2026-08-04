import { Box, Paper, Typography } from "@mui/material";
import type { FC } from "react";

import { activityItems, type ActivityType } from "@/widgets";

import styles from "./ActivityChart.module.scss";

const activityClassNames: Record<ActivityType, string> = {
  media: styles.mediaBar,
  photos: styles.photosBar,
  docs: styles.docsBar,
};

export const ActivityChart: FC = () => {
  return (
    <Paper className={styles.activityCard} elevation={0}>
      <Typography component="h2">Activity Chart</Typography>

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
