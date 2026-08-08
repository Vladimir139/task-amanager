import { ExpandMore, Folder } from "@mui/icons-material";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import type { FC } from "react";

import type { Folder as FolderType } from "@/entities/folder";
import { FolderCard, useGetFoldersQuery } from "@/entities/folder";
import { useGetUsersQuery } from "@/entities/user";
import { getInitials } from "@/shared/lib/formatters";

import styles from "./FoldersList.module.scss";

const mapFolderColor = (color: string): FolderType["color"] => {
  if (["blue", "purple", "yellow", "green", "red"].includes(color)) {
    return color as FolderType["color"];
  }

  return "blue";
};

export const FoldersList: FC = () => {
  const { data, isError, isLoading } = useGetFoldersQuery();
  const { data: users } = useGetUsersQuery();

  const userMap = new Map((users ?? []).map((user) => [user._id, user]));
  const folders =
    data?.map((folder) => ({
      color: mapFolderColor(folder.color),
      filesCount: folder.fileCount,
      id: folder._id,
      members:
        folder.memberIds
          ?.slice(0, 2)
          .map((memberId) => userMap.get(memberId))
          .filter(Boolean)
          .map((member) => getInitials(member?.firstName, member?.lastName)) ?? [],
      name: folder.name,
    })) ?? [];

  const handleFolderClick = (folder: FolderType) => {
    console.log("Open folder:", folder);
  };

  return (
    <Paper className={styles.foldersSection} elevation={0}>
      <Box className={styles.foldersHeader}>
        <Box className={styles.foldersTitle}>
          <Box className={styles.allFilesIcon}>
            <Folder />
          </Box>

          <IconButton aria-label="Expand folder tree">
            <ExpandMore />
          </IconButton>

          <Typography>All Files</Typography>
        </Box>

        <button type="button" className={styles.showAllButton}>
          Show All
          <ExpandMore />
        </button>
      </Box>

      {isError && <Typography>Unable to load folders.</Typography>}
      {isLoading && <Typography>Loading folders...</Typography>}

      <Box className={styles.foldersGrid}>
        {folders.map((folder) => (
          <FolderCard key={folder.id} folder={folder} onClick={handleFolderClick} />
        ))}
      </Box>
    </Paper>
  );
};
