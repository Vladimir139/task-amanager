import { MicNoneOutlined, MoreHoriz } from "@mui/icons-material";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import type { ChangeEvent, FC, KeyboardEvent } from "react";

import type { BoardMember } from "@/entities/boardMember";
import { BoardMemberAvatar } from "@/entities/boardMember";
import type { BoardMessage } from "@/entities/boardMessage";
import { BoardMessageItem } from "@/entities/boardMessage";

import styles from "./TaskBoardSidebar.module.scss";

interface TaskBoardSidebarProps {
  isSubmitting?: boolean;
  members: BoardMember[];
  membersCount: number;
  message: string;
  messages: BoardMessage[];
  onMessageChange: (value: string) => void;
  onMessageSubmit: () => void;
}

export const TaskBoardSidebar: FC<TaskBoardSidebarProps> = ({
  isSubmitting = false,
  members,
  membersCount,
  messages,
  message,
  onMessageChange,
  onMessageSubmit,
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
            Member <span>({membersCount})</span>
          </Typography>

          <button type="button">View All</button>
        </Box>

        <Box className={styles.membersList}>
          {members.map((member) => (
            <BoardMemberAvatar key={member.id} member={member} showStatus />
          ))}
        </Box>
      </Box>

      <section className={styles.chatSection}>
        <Typography component="h2">Group Chat</Typography>

        <Box className={styles.messages}>
          {messages.map((chatMessage) => (
            <BoardMessageItem key={chatMessage.id} message={chatMessage} />
          ))}
        </Box>
      </section>

      <Box className={styles.messageInputWrapper}>
        <TextField
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="write here..."
          className={styles.messageInput}
          fullWidth
        />

        <IconButton aria-label="Record voice message">
          <MicNoneOutlined />
        </IconButton>

        <IconButton aria-label="Send message" onClick={onMessageSubmit} disabled={isSubmitting}>
          <MoreHoriz />
        </IconButton>
      </Box>
    </aside>
  );
};
