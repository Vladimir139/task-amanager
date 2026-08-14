import { Avatar, Box, Typography } from "@mui/material";
import type { FC } from "react";

import type { MessageItemProps } from "../../model/types";
import styles from "./MessageItem.module.scss";

export const MessageItem: FC<MessageItemProps> = ({ message }) => {
  return (
    <Box className={styles.message}>
      <Avatar className={styles.messageAvatar} sx={{ borderColor: message.color }}>
        {message.avatar}
      </Avatar>

      <Box className={styles.messageContent}>
        <Box className={styles.messageHeader}>
          <Typography>{message.name}</Typography>
          {!!message.unreadCount && (
            <span className={styles.unreadBadge}>{message.unreadCount}</span>
          )}
        </Box>
        <Typography>{message.message}</Typography>
      </Box>
    </Box>
  );
};
