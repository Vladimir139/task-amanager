import { Check, MicNone } from "@mui/icons-material";
import { Avatar, Box, Typography } from "@mui/material";
import type { FC } from "react";

import type { ConversationItemProps } from "../model/types";
import styles from "./ConversationItem.module.scss";

export const ConversationItem: FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onClick,
}) => {
  const handleClick = () => {
    onClick(conversation);
  };

  return (
    <button
      type="button"
      className={`${styles.conversation} ${isActive ? styles.activeConversation : ""}`}
      onClick={handleClick}
    >
      <Box className={styles.conversationAvatar}>
        <Avatar src={conversation.avatar} alt={conversation.name} />

        {conversation.isOnline && <span className={styles.onlineIndicator} aria-label="Online" />}
      </Box>

      <Box className={styles.conversationContent}>
        <Box className={styles.conversationHeader}>
          <Typography>{conversation.name}</Typography>
          <Typography>{conversation.time}</Typography>
        </Box>

        <Box className={styles.conversationPreview}>
          <Typography className={conversation.isTyping ? styles.typing : undefined}>
            {conversation.isVoice && <MicNone />}
            {conversation.preview}
          </Typography>

          {!!conversation.unread && (
            <span className={styles.unreadBadge}>{conversation.unread}</span>
          )}

          {conversation.isRead && (
            <Box className={styles.readStatus} aria-label="Message read">
              <Check />
              <Check />
            </Box>
          )}
        </Box>
      </Box>
    </button>
  );
};
