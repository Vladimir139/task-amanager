import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import type { FC } from "react";

import { useGetStorageSummaryQuery } from "@/entities/file";
import { type StorageItem, StorageItemRow } from "@/entities/storage";
import { formatBytes } from "@/shared/lib/formatters";

import styles from "./StorageOverview.module.scss";

const storageKinds: Record<string, StorageItem["type"]> = {
  audio: "music",
  document: "documents",
  figma: "other",
  illustrator: "other",
  image: "media",
  other: "other",
  sketch: "other",
  svg: "other",
  video: "media",
  xd: "other",
};

const storageTitles: Record<StorageItem["type"], string> = {
  documents: "Documents",
  media: "Media",
  music: "Music",
  other: "Other File",
};

export const StorageOverview: FC = () => {
  const { data, isError, isLoading } = useGetStorageSummaryQuery();

  const totalSize = (data ?? []).reduce((sum, item) => sum + item.totalSize, 0);
  const aggregated = (data ?? []).reduce<Record<StorageItem["type"], number>>(
    (result, item) => {
      const type = storageKinds[item._id] ?? "other";
      result[type] += item.totalSize;
      return result;
    },
    {
      documents: 0,
      media: 0,
      music: 0,
      other: 0,
    },
  );

  const storageItems: StorageItem[] = (
    Object.entries(aggregated) as Array<[StorageItem["type"], number]>
  ).map(([type, size]) => ({
    id: type,
    percentage: totalSize > 0 ? Math.round((size / totalSize) * 100) : 0,
    title: storageTitles[type],
    type,
    value: formatBytes(size),
  }));

  const trackedGroups = storageItems.filter((item) => item.percentage > 0).length;
  const usedStoragePercentage = totalSize > 0 ? 100 : 0;

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

          <Typography>{trackedGroups}</Typography>
        </Box>

        <Box>
          <Typography>Tracked storage groups</Typography>
          <Typography>{formatBytes(totalSize)} total</Typography>
        </Box>
      </Box>

      {isError && <Typography>Unable to load storage summary.</Typography>}
      {isLoading && <Typography>Loading storage summary...</Typography>}

      <Box className={styles.storageList}>
        {storageItems.map((item) => (
          <StorageItemRow key={item.id} item={item} />
        ))}
      </Box>
    </Paper>
  );
};
