import { Box, Typography } from "@mui/material";
import type { FC } from "react";

import type { ChatMember } from "@/entities/chatMember";
import { type ChatMessage, ChatMessageItem } from "@/entities/chatMessage";
import { ChatHeader, MessageComposer } from "@/widgets";

import styles from "./ChatWindow.module.scss";

interface ChatWindowProps {
  avatar: string;
  isLoading?: boolean;
  isSubmitting?: boolean;
  members: ChatMember[];
  membersCount: number;
  messages: ChatMessage[];
  newMessage: string;
  onlineCount: number;
  onMessageChange: (value: string) => void;
  onMessageSubmit: () => void;
  title: string;
}

export const ChatWindow: FC<ChatWindowProps> = ({
  avatar,
  isLoading = false,
  isSubmitting = false,
  members,
  membersCount,
  messages,
  newMessage,
  onlineCount,
  onMessageChange,
  onMessageSubmit,
  title,
}) => {
  const firstMessage = messages[0];
  const nextMessages = messages.slice(1);

  return (
    <section className={styles.chat}>
      <ChatHeader
        title={title}
        avatar={avatar}
        members={members}
        membersCount={membersCount}
        onlineCount={onlineCount}
      />

      <Box className={styles.messages}>
        {isLoading && <Typography>Loading messages...</Typography>}

        {firstMessage && <ChatMessageItem key={firstMessage.id} message={firstMessage} />}

        {messages.length > 1 && (
          <Box className={styles.dateDivider}>
            <span />
            <Typography>Conversation</Typography>
            <span />
          </Box>
        )}

        {nextMessages.map((message) => (
          <ChatMessageItem key={message.id} message={message} />
        ))}
      </Box>

      <MessageComposer
        value={newMessage}
        onChange={onMessageChange}
        onSubmit={onMessageSubmit}
        isSubmitting={isSubmitting}
      />
    </section>
  );
};
