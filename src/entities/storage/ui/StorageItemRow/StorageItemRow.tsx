import {
  DescriptionOutlined,
  ImageOutlined,
  InsertDriveFileOutlined,
  MusicNoteOutlined,
} from "@mui/icons-material";
import { Box, LinearProgress, Typography } from "@mui/material";
import type { FC, ReactNode } from "react";

import type { StorageItemRowProps, StorageType } from "@/entities/storage";

import styles from "./StorageItemRow.module.scss";

const icons: Record<StorageType, ReactNode> = {
  media: <ImageOutlined />,
  documents: <DescriptionOutlined />,
  music: <MusicNoteOutlined />,
  other: <InsertDriveFileOutlined />,
};

const storageClassNames: Record<StorageType, string> = {
  media: styles.mediaStorage,
  documents: styles.documentsStorage,
  music: styles.musicStorage,
  other: styles.otherStorage,
};

export const StorageItemRow: FC<StorageItemRowProps> = ({ item }) => {
  const typeClassName = storageClassNames[item.type];

  return (
    <Box className={styles.storageItem}>
      <Box className={`${styles.storageIcon} ${typeClassName}`}>{icons[item.type]}</Box>

      <Box className={styles.storageInformation}>
        <Box>
          <Typography>{item.title}</Typography>
          <Typography>{item.value}</Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={item.percentage}
          className={`${styles.storageProgress} ${typeClassName}`}
          aria-label={`${item.title}: ${item.percentage}%`}
        />
      </Box>
    </Box>
  );
};
