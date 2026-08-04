import { ExpandMore, Folder } from "@mui/icons-material";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import type { FC } from "react";

import type { Folder as FolderType } from "@/entities/folder";
import { FolderCard } from "@/entities/folder";

import { folders } from "../model/folders.data";
import styles from "./FoldersList.module.scss";

export const FoldersList: FC = () => {
  const handleFolderClick = (folder: FolderType) => {
    console.log("Open folder:", folder);
  };

  const handleShowAll = () => {
    console.log("Show all folders");
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

        <button type="button" className={styles.showAllButton} onClick={handleShowAll}>
          Show All
          <ExpandMore />
        </button>
      </Box>

      <Box className={styles.foldersGrid}>
        {folders.map((folder) => (
          <FolderCard key={folder.id} folder={folder} onClick={handleFolderClick} />
        ))}
      </Box>
    </Paper>
  );
};
