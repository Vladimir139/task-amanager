import { Folder as FolderIcon } from "@mui/icons-material";
import { Avatar, AvatarGroup, Box, Typography } from "@mui/material";
import type { FC } from "react";

import type { FolderCardProps, FolderColor } from "@/entities/folder";

import styles from "./FolderCard.module.scss";

const folderClassNames: Record<FolderColor, string> = {
  blue: styles.blueFolder,
  purple: styles.purpleFolder,
  yellow: styles.yellowFolder,
  green: styles.greenFolder,
  red: styles.redFolder,
};

export const FolderCard: FC<FolderCardProps> = ({ folder, onClick }) => {
  const handleClick = () => {
    onClick?.(folder);
  };

  return (
    <button type="button" className={styles.folderCard} onClick={handleClick}>
      <Box className={styles.folderCardHeader}>
        <FolderIcon className={`${styles.folderIcon} ${folderClassNames[folder.color]}`} />

        {!!folder.members?.length && (
          <AvatarGroup max={2} className={styles.folderMembers}>
            {folder.members.map((member) => (
              <Avatar key={`${folder.id}-${member}`}>{member}</Avatar>
            ))}
          </AvatarGroup>
        )}
      </Box>

      <Box className={styles.folderInformation}>
        <Typography>{folder.name}</Typography>
        <Typography>{folder.filesCount} files</Typography>
      </Box>
    </button>
  );
};
