import { MoreVert } from "@mui/icons-material";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import type { FC } from "react";

import type { ChatMessageItemProps } from "../model/types";
import styles from "./ChatMessageItem.module.scss";

export const ChatMessageItem: FC<ChatMessageItemProps> = ({ message }) => {
  return (
    <Box className={`${styles.message} ${message.isOwn ? styles.ownMessage : ""}`}>
      {!message.isOwn && (
        <Avatar src={message.avatar} alt={message.author} className={styles.messageAvatar} />
      )}

      <Box className={styles.messageContent}>
        <Box className={styles.messageInformation}>
          <Typography>{message.author}</Typography>
          <Typography>{message.time}</Typography>
        </Box>

        {!!message.text?.length && (
          <Box className={styles.messageBubbles}>
            {message.text.map((text, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Box className={styles.messageBubble} key={`${message.id}-${index}`}>
                <Typography>{text}</Typography>

                <IconButton aria-label={`Actions for message ${index + 1}`}>
                  <MoreVert />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        {!!message.attachments?.length && (
          <Box className={styles.messageAttachments}>
            {message.attachments.map((attachment) => (
              <Box
                component="img"
                key={attachment.id}
                src={attachment.image}
                alt={`Attachment from ${message.author}`}
              />
            ))}
          </Box>
        )}
      </Box>

      {message.isOwn && (
        <Avatar src={message.avatar} alt={message.author} className={styles.messageAvatar} />
      )}
    </Box>
  );
};
