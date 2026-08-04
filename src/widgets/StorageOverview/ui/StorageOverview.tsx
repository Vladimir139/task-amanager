import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import type { FC } from "react";

import { StorageItemRow } from "@/entities/storage";
import { storageItems } from "@/widgets";

import styles from "./StorageOverview.module.scss";

const usedStoragePercentage = 85;

export const StorageOverview: FC = () => {
  return (
    <Paper className={styles.storageCard} elevation={0}>
      <Box className={styles.storageSummary}>
        <Box className={styles.progressWrapper}>
          <CircularProgress
            variant="determinate"
            value={100}
            className={styles.progressBackground}
            size={92}
            thickness={5}
          />

          <CircularProgress
            variant="determinate"
            value={usedStoragePercentage}
            className={styles.progressValue}
            size={92}
            thickness={5}
          />

          <Typography>{usedStoragePercentage}%</Typography>
        </Box>

        <Box>
          <Typography>Available Storage</Typography>
          <Typography>130GB / 512GB</Typography>
        </Box>
      </Box>

      <Box className={styles.storageList}>
        {storageItems.map((item) => (
          <StorageItemRow key={item.id} item={item} />
        ))}
      </Box>
    </Paper>
  );
};
