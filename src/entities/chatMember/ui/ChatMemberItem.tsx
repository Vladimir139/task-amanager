import { Avatar, Box, Button, Typography } from "@mui/material";
import type { FC } from "react";

import { getAvatarColors, getAvatarInitials } from "@/shared/lib/formatters";

import type { ChatMemberItemProps } from "../model/types";
import styles from "./ChatMemberItem.module.scss";

export const ChatMemberItem: FC<ChatMemberItemProps> = ({ member }) => {
  const avatarColors = getAvatarColors(String(member.id));

  return (
    <Box className={styles.member}>
      <Box className={styles.avatarWrapper}>
        <Avatar src={member.avatar} alt={member.name} sx={member.avatar ? undefined : avatarColors}>
          {getAvatarInitials(member.name)}
        </Avatar>
        {member.isOnline && <span className={styles.status} aria-label="Online" />}
      </Box>

      <Box className={styles.memberContent}>
        <Typography className={styles.memberName}>
          {member.name}
          {member.isCurrentUser ? " (You)" : ""}
        </Typography>
        {member.subtitle && (
          <Typography className={styles.memberSubtitle}>{member.subtitle}</Typography>
        )}
      </Box>

      {member.canRemove && member.onRemove && (
        <Button
          size="small"
          color="error"
          variant="text"
          className={styles.removeButton}
          onClick={member.onRemove}
        >
          Remove
        </Button>
      )}
    </Box>
  );
};
