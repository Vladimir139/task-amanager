import { Box, Typography } from "@mui/material";
import type { FC } from "react";
import { useState } from "react";

import { ChatMessageItem } from "@/entities/chatMessage";
import { CHAT_DATE_LABEL, ChatHeader, chatMembers, chatMessages, MessageComposer } from "@/widgets";

import styles from "./ChatWindow.module.scss";

interface ChatWindowProps {
  conversationId: number;
}

export const ChatWindow: FC<ChatWindowProps> = ({ conversationId }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = () => {
    const normalizedMessage = newMessage.trim();

    if (!normalizedMessage) {
      return;
    }

    console.log("Send message:", {
      conversationId,
      text: normalizedMessage,
    });

    setNewMessage("");
  };

  return (
    <section className={styles.chat}>
      <ChatHeader
        title="Design Team"
        avatar="/images/users/design-team.jpg"
        members={chatMembers}
        membersCount={60}
        onlineCount={10}
      />

      <Box className={styles.messages}>
        {chatMessages.slice(0, 1).map((message) => (
          <ChatMessageItem key={message.id} message={message} />
        ))}

        <Box className={styles.dateDivider}>
          <span />
          <Typography>{CHAT_DATE_LABEL}</Typography>
          <span />
        </Box>

        {chatMessages.slice(1).map((message) => (
          <ChatMessageItem key={message.id} message={message} />
        ))}
      </Box>

      <MessageComposer value={newMessage} onChange={setNewMessage} onSubmit={handleSubmit} />
    </section>
  );
};
