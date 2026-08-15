import { Box, Typography } from "@mui/material";
import type { FC } from "react";

import type { ChatMember } from "@/entities/chatMember";
import { type ChatMessage, ChatMessageItem } from "@/entities/chatMessage";
import { useStatusToast } from "@/shared/lib/toast/useStatusToast";
import type { RecordedAudioPayload } from "@/shared/ui/molecules/VoiceRecorderButton/VoiceRecorderButton";
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
  onUploadAudio: (payload: RecordedAudioPayload) => void;
  title: string;
  typingText?: string | null;
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
  typingText = null,
}) => {
  const firstMessage = messages[0];
  const nextMessages = messages.slice(1);

  useStatusToast({
    message: composerStatusMessage,
    tone: composerStatusTone,
  });

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
        {typingText && <Typography className={styles.typingIndicator}>{typingText}</Typography>}
        {isLoading && <Typography>Loading messages...</Typography>}
        {!isLoading && messages.length === 0 && (
          <Typography className={styles.emptyState}>
            No messages yet. Start the conversation.
          </Typography>
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
