import { Folder as FolderIcon } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import type { FC } from "react";

import type { FolderCardProps, FolderColor } from "@/entities/folder";
import { MemberAvatarStack } from "@/shared/ui/molecules/MemberAvatarStack/MemberAvatarStack";

import styles from "./FolderCard.module.scss";

const folderClassNames: Record<FolderColor, string> = {
  blue: styles.blueFolder,
  purple: styles.purpleFolder,
  yellow: styles.yellowFolder,
  green: styles.greenFolder,
  red: styles.redFolder,
};

export const FolderCard: FC<FolderCardProps> = ({ folder, isActive = false, onClick }) => {
  const handleClick = () => {
    onClick?.(folder);
  };

  return (
    <button
      type="button"
      className={`${styles.folderCard} ${isActive ? styles.activeFolderCard : ""}`}
      onClick={handleClick}
    >
      <Box className={styles.folderCardHeader}>
        <FolderIcon className={`${styles.folderIcon} ${folderClassNames[folder.color]}`} />

        {!!folder.members?.length && (
          <MemberAvatarStack
            items={folder.members.map((member, index) => ({
              id: `${folder.id}-${index}`,
              initials: member,
              name: member,
            }))}
            renderAsButton={false}
            title={`${folder.name} members`}
          />
        )}
      </Box>

      <Box className={styles.folderInformation}>
        <Typography>{folder.name}</Typography>
        <Typography>{folder.filesCount} files</Typography>
      </Box>
    </button>
  );
};
