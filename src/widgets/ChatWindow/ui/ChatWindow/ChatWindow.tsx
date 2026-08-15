import { Box, Typography } from "@mui/material";
import { type FC, useEffect, useMemo, useRef } from "react";

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
  unreadCount?: number;
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
  unreadCount = 0,
}) => {
  const firstUnreadIndex = useMemo(() => {
    if (unreadCount <= 0 || unreadCount >= messages.length) {
      return unreadCount >= messages.length && messages.length > 0 ? 0 : -1;
    }

    return Math.max(messages.length - unreadCount, 0);
  }, [messages.length, unreadCount]);
  const firstUnreadRef = useRef<HTMLDivElement | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }

    const target = firstUnreadIndex >= 0 ? firstUnreadRef.current : lastMessageRef.current;
    target?.scrollIntoView({
      block: firstUnreadIndex >= 0 ? "start" : "end",
      behavior: "smooth",
    });
  }, [firstUnreadIndex, messages.length, title]);

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

        {messages.map((message, index) => (
          <Box key={message.id} ref={index === messages.length - 1 ? lastMessageRef : undefined}>
            {index === firstUnreadIndex && (
              <Box ref={firstUnreadRef} className={styles.unreadDivider}>
                <span />
                <Typography>Unread messages</Typography>
                <span />
              </Box>
            )}
            <ChatMessageItem message={message} />
          </Box>
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
