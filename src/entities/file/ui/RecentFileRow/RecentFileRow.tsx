import { MoreVert } from "@mui/icons-material";
import { Avatar, AvatarGroup, Box, IconButton, Typography } from "@mui/material";
import type { FC } from "react";

import { FileIcon, type RecentFileRowProps } from "@/entities/file";

import styles from "./RecentFileRow.module.scss";

export const RecentFileRow: FC<RecentFileRowProps> = ({ file }) => {
  const handleOpenActions = () => {
    console.log("Open file actions:", file.id);
  };

  return (
    <Box className={styles.fileRow}>
      <Box className={styles.fileName}>
        <FileIcon type={file.type} />
        <Typography>{file.name}</Typography>
      </Box>

      <Typography className={styles.fileSize}>{file.size}</Typography>

      <Typography className={styles.fileModified}>{file.lastModified}</Typography>

      <AvatarGroup max={5} className={styles.fileMembers}>
        {file.members.map((member) => (
          <Avatar key={`${file.id}-${member}`}>{member}</Avatar>
        ))}
      </AvatarGroup>

      <IconButton
        className={styles.fileActions}
        aria-label={`Actions for ${file.name}`}
        onClick={handleOpenActions}
      >
        <MoreVert />
      </IconButton>
    </Box>
  );
};
