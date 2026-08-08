import { Avatar, Box, Typography } from "@mui/material";
import type { FC } from "react";

import type { ChatMemberItemProps } from "../model/types";
import styles from "./ChatMemberItem.module.scss";

export const ChatMemberItem: FC<ChatMemberItemProps> = ({ member }) => {
  return (
    <Box className={styles.member}>
      <Box className={styles.avatarWrapper}>
        <Avatar src={member.avatar} alt={member.name} />
        {member.isOnline && <span className={styles.status} aria-label="Online" />}
      </Box>
      <Typography>{member.name}</Typography>
    </Box>
  );
};
