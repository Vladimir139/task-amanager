import { Box, Typography } from "@mui/material";
import type { FC, ReactNode } from "react";

import type { SharedFileItemProps, SharedFileType } from "../model/types";
import styles from "./SharedFileItem.module.scss";

const fileIcons: Record<SharedFileType, ReactNode> = {
  figma: <span>Fg</span>,
  sketch: <span>◆</span>,
  xd: <span>Xd</span>,
  svg: <span>SVG</span>,
};

const fileClassNames: Record<SharedFileType, string> = {
  figma: styles.figmaFile,
  sketch: styles.sketchFile,
  xd: styles.xdFile,
  svg: styles.svgFile,
};

export const SharedFileItem: FC<SharedFileItemProps> = ({ file }) => {
  return (
    <Box className={styles.file}>
      <Box className={`${styles.fileIcon} ${fileClassNames[file.type]}`}>
        {fileIcons[file.type]}
      </Box>

      <Box className={styles.fileInformation}>
        <Typography>{file.name}</Typography>
        <Typography>{file.information}</Typography>
      </Box>
    </Box>
  );
};
