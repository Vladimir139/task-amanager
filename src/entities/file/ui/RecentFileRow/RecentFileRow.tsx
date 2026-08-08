import { DeleteOutlined, OpenInNew } from "@mui/icons-material";
import { Avatar, AvatarGroup, Box, IconButton, Typography } from "@mui/material";
import type { FC } from "react";

import { FileIcon, type RecentFileRowProps } from "@/entities/file";

import styles from "./RecentFileRow.module.scss";

export const RecentFileRow: FC<RecentFileRowProps> = ({ file }) => {
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

      <Box className={styles.fileActions}>
        {file.openUrl && (
          <IconButton
            className={styles.actionButton}
            aria-label={`Open ${file.name}`}
            component="a"
            href={file.openUrl}
            target="_blank"
            rel="noreferrer"
          >
            <OpenInNew />
          </IconButton>
        )}

        {file.onDelete && (
          <IconButton
            className={styles.actionButton}
            aria-label={`Delete ${file.name}`}
            onClick={file.onDelete}
            disabled={file.isDeleting}
          >
            <DeleteOutlined />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};
