import {
  AudioFileOutlined,
  DescriptionOutlined,
  ImageOutlined,
  InsertDriveFileOutlined,
  MovieOutlined,
} from "@mui/icons-material";
import { Box } from "@mui/material";
import type { FC, ReactNode } from "react";

import type { FileIconProps, FileType } from "@/entities/file";

import styles from "../RecentFileRow/RecentFileRow.module.scss";

const icons: Record<FileType, ReactNode> = {
  audio: <AudioFileOutlined />,
  document: <DescriptionOutlined />,
  figma: <span className={styles.figmaIcon}>F</span>,
  illustrator: <span className={styles.illustratorIcon}>Ai</span>,
  image: <ImageOutlined />,
  other: <InsertDriveFileOutlined />,
  sketch: <span className={styles.figmaIcon}>S</span>,
  svg: <span className={styles.figmaIcon}>SVG</span>,
  video: <MovieOutlined />,
  xd: <span className={styles.figmaIcon}>Xd</span>,
};

const iconClassNames: Record<FileType, string> = {
  audio: styles.documentFileIcon,
  document: styles.documentFileIcon,
  figma: styles.figmaFileIcon,
  illustrator: styles.illustratorFileIcon,
  image: styles.imageFileIcon,
  other: styles.documentFileIcon,
  sketch: styles.figmaFileIcon,
  svg: styles.figmaFileIcon,
  video: styles.imageFileIcon,
  xd: styles.figmaFileIcon,
};

export const FileIcon: FC<FileIconProps> = ({ type }) => {
  return <Box className={`${styles.fileIcon} ${iconClassNames[type]}`}>{icons[type]}</Box>;
};
