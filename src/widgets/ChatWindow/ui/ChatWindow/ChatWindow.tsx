import { Alert, Box, Typography } from "@mui/material";
import type { FC } from "react";

import type { ChatMember } from "@/entities/chatMember";
import { type ChatMessage, ChatMessageItem } from "@/entities/chatMessage";
import { ChatHeader, MessageComposer } from "@/widgets";

import styles from "./ChatWindow.module.scss";

interface ChatWindowProps {
  avatar: string;
  composerStatusMessage?: string | null;
  composerStatusTone?: "error" | "success" | null;
  isLoading?: boolean;
  isSubmitting?: boolean;
  members: ChatMember[];
  membersCount: number;
  messages: ChatMessage[];
  newMessage: string;
  onAttachImages: (files: FileList | null) => void;
  onlineCount: number;
  onMessageChange: (value: string) => void;
  onMessageSubmit: () => void;
  onUploadAudio: (files: FileList | null) => void;
  title: string;
}

export const ChatWindow: FC<ChatWindowProps> = ({
  avatar,
  composerStatusMessage = null,
  composerStatusTone = null,
  isLoading = false,
  isSubmitting = false,
  members,
  membersCount,
  messages,
  newMessage,
  onAttachImages,
  onlineCount,
  onMessageChange,
  onMessageSubmit,
  onUploadAudio,
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
        {composerStatusMessage && composerStatusTone && (
          <Alert severity={composerStatusTone}>{composerStatusMessage}</Alert>
        )}
        {isLoading && <Typography>Loading messages...</Typography>}
        {!isLoading && messages.length === 0 && (
          <Typography>No messages yet. Start the conversation.</Typography>
        )}

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
        isDisabled={isLoading}
        onAttachImages={onAttachImages}
        value={newMessage}
        onChange={onMessageChange}
        onSubmit={onMessageSubmit}
        onUploadAudio={onUploadAudio}
        isSubmitting={isSubmitting}
      />
    </section>
  );
};
