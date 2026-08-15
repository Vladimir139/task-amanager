import { DeleteOutlined, DownloadOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import type { FC } from "react";

import { FileIcon, type RecentFileRowProps } from "@/entities/file";
import { MemberAvatarStack } from "@/shared/ui/molecules/MemberAvatarStack/MemberAvatarStack";

import styles from "./RecentFileRow.module.scss";

export const RecentFileRow: FC<RecentFileRowProps> = ({ file }) => {
  return (
    <Box className={styles.fileRow}>
      <Box className={styles.fileName}>
        <FileIcon type={file.type} />
        <Box className={styles.fileNameText}>
          <Typography>{file.name}</Typography>
          {file.locationLabel && (
            <Typography className={styles.fileLocation}>{file.locationLabel}</Typography>
          )}
        </Box>
      </Box>

      <Typography className={styles.fileFolder}>{file.folderName ?? "—"}</Typography>

      <Typography className={styles.fileSize}>{file.size}</Typography>

      <Typography className={styles.fileModified}>{file.lastModified}</Typography>

      <MemberAvatarStack
        items={file.members.map((member, index) => ({
          id: `${file.id}-${index}`,
          initials: member,
          name: member,
        }))}
        title={`${file.name} members`}
      />

      <Box className={styles.fileActions}>
        {file.openUrl && (
          <IconButton
            className={styles.actionButton}
            aria-label={`Download ${file.name}`}
            component="a"
            href={file.openUrl}
            download
          >
            <DownloadOutlined />
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
