import { Box, Typography } from "@mui/material";
import type { FC } from "react";

import { MessageItem } from "@/entities/message/ui";

import { messages } from "../model/messages.data";
import styles from "./MessagesPreview.module.scss";

export const MessagesPreview: FC = () => {
  return (
    <section className={styles.messagesSection}>
      <Typography component="h2">Messages</Typography>

      <Box className={styles.messagesList}>
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </Box>
    </section>
  );
};
