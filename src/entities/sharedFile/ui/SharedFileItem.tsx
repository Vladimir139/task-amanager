import { Box, Typography } from "@mui/material";
import type { FC, ReactNode } from "react";

import type { SharedFileItemProps, SharedFileType } from "../model/types";
import styles from "./SharedFileItem.module.scss";

const fileIcons: Record<SharedFileType, ReactNode> = {
  audio: <span>Au</span>,
  document: <span>Doc</span>,
  figma: <span>Fg</span>,
  illustrator: <span>Ai</span>,
  image: <span>Img</span>,
  other: <span>File</span>,
  sketch: <span>◆</span>,
  svg: <span>SVG</span>,
  video: <span>Vid</span>,
  xd: <span>Xd</span>,
};

const fileClassNames: Record<SharedFileType, string> = {
  audio: styles.svgFile,
  document: styles.sketchFile,
  figma: styles.figmaFile,
  illustrator: styles.xdFile,
  image: styles.figmaFile,
  other: styles.sketchFile,
  sketch: styles.sketchFile,
  svg: styles.svgFile,
  video: styles.xdFile,
  xd: styles.xdFile,
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
