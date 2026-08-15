import { SendRounded } from "@mui/icons-material";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import type { ChangeEvent, FC, KeyboardEvent } from "react";

import type { BoardMember } from "@/entities/boardMember";
import { BoardMemberAvatar } from "@/entities/boardMember";
import type { BoardMessage } from "@/entities/boardMessage";
import { BoardMessageItem } from "@/entities/boardMessage";
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
          {members.map((member) => (
            <BoardMemberAvatar key={member.id} member={member} showStatus />
          ))}
        </Box>
      </Box>

      <section className={styles.chatSection}>
        <Typography component="h2">Group Chat</Typography>
        {typingText && <Typography className={styles.typingText}>{typingText}</Typography>}

        <Box className={styles.messages}>
          {isError ? (
            <Typography className={styles.emptyState}>Unable to load board messages.</Typography>
          ) : messages.length > 0 ? (
            messages.map((chatMessage) => (
              <BoardMessageItem key={chatMessage.id} message={chatMessage} />
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
