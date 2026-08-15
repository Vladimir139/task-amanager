import { SendRounded } from "@mui/icons-material";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import type { ChangeEvent, FC, KeyboardEvent } from "react";
import { useEffect, useMemo, useRef } from "react";

import type { BoardMember } from "@/entities/boardMember";
import type { BoardMessage } from "@/entities/boardMessage";
import { BoardMessageItem } from "@/entities/boardMessage";
import { MemberAvatarStack } from "@/shared/ui/molecules/MemberAvatarStack/MemberAvatarStack";
import {
  type RecordedAudioPayload,
  VoiceRecorderButton,
} from "@/shared/ui/molecules/VoiceRecorderButton/VoiceRecorderButton";

import styles from "./TaskBoardSidebar.module.scss";

interface TaskBoardSidebarProps {
  canWrite?: boolean;
  isError?: boolean;
  isSubmitting?: boolean;
  members: BoardMember[];
  membersCount: number;
  message: string;
  onAudioRecorded: (payload: RecordedAudioPayload) => void;
  messages: BoardMessage[];
  onMessageChange: (value: string) => void;
  onMessageSubmit: () => void;
  typingText?: string | null;
}

export const TaskBoardSidebar: FC<TaskBoardSidebarProps> = ({
  canWrite = true,
  isError = false,
  isSubmitting = false,
  members,
  membersCount,
  messages,
  message,
  onAudioRecorded,
  onMessageChange,
  onMessageSubmit,
  typingText = null,
}) => {
  const firstUnreadIndex = useMemo(
    () => messages.findIndex((item) => !item.isOwn && !item.isRead),
    [messages],
  );
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
  }, [firstUnreadIndex, messages.length]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onMessageChange(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    onMessageSubmit();
  };

  return (
    <aside className={styles.chatSidebar}>
      <Box>
        <Box className={styles.membersHeader}>
          <Typography>
            Members <span>({membersCount})</span>
          </Typography>
        </Box>

        <Box className={styles.membersList}>
          <MemberAvatarStack
            items={members.map((member) => ({ ...member, name: member.name ?? member.initials }))}
            title="Board members"
          />
        </Box>
      </Box>

      <section className={styles.chatSection}>
        <Typography component="h2">Group Chat</Typography>
        {typingText && <Typography className={styles.typingText}>{typingText}</Typography>}

        <Box className={styles.messages}>
          {isError ? (
            <Typography className={styles.emptyState}>Unable to load board messages.</Typography>
          ) : messages.length > 0 ? (
            messages.map((chatMessage, index) => (
              <Box
                key={chatMessage.id}
                ref={index === messages.length - 1 ? lastMessageRef : undefined}
              >
                {index === firstUnreadIndex && (
                  <Typography ref={firstUnreadRef} className={styles.typingText}>
                    Unread messages
                  </Typography>
                )}
                <BoardMessageItem message={chatMessage} />
              </Box>
            ))
          ) : (
            <Typography className={styles.emptyState}>
              No messages yet. Start the conversation.
            </Typography>
          )}
        </Box>
      </section>

      <Box className={styles.messageInputWrapper}>
        <TextField
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={canWrite ? "write here..." : "View-only board chat"}
          className={styles.messageInput}
          disabled={!canWrite}
          fullWidth
        />

        <VoiceRecorderButton disabled={isSubmitting || !canWrite} onRecorded={onAudioRecorded} />

        <IconButton
          aria-label="Send message"
          onClick={onMessageSubmit}
          disabled={isSubmitting || !canWrite}
        >
          <SendRounded />
        </IconButton>
      </Box>
    </aside>
  );
};
