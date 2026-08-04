import { DescriptionOutlined, ImageOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";
import type { FC, ReactNode } from "react";

import type { FileIconProps, FileType } from "@/entities/file";

import styles from "../RecentFileRow/RecentFileRow.module.scss";

const icons: Record<FileType, ReactNode> = {
  document: <DescriptionOutlined />,
  image: <ImageOutlined />,
  figma: <span className={styles.figmaIcon}>F</span>,
  illustrator: <span className={styles.illustratorIcon}>Ai</span>,
};

const iconClassNames: Record<FileType, string> = {
  document: styles.documentFileIcon,
  image: styles.imageFileIcon,
  figma: styles.figmaFileIcon,
  illustrator: styles.illustratorFileIcon,
};

export const FileIcon: FC<FileIconProps> = ({ type }) => {
  return <Box className={`${styles.fileIcon} ${iconClassNames[type]}`}>{icons[type]}</Box>;
};
