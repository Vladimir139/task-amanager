import { PlayArrowOutlined } from "@mui/icons-material";
import { Box, Button, TextField, Typography } from "@mui/material";
import type { FC } from "react";

import { BoardMemberAvatar } from "@/entities/boardMember";

import type { BoardAudioMessage, BoardMessageItemProps } from "../../model/types.ts";
import styles from "./BoardMessageItem.module.scss";

function AudioMessage({ duration, src, waveform }: BoardAudioMessage) {
  return (
    <Box className={styles.audioMessage}>
      <Box className={styles.audioHeader}>
        <PlayArrowOutlined />
        <Typography>{duration}</Typography>
      </Box>

      <Box className={styles.audioWave}>
        {waveform.map((bar) => (
          <span
            key={bar.id}
            style={{
              height: bar.height,
            }}
          />
        ))}
      </Box>

      <audio controls src={src} className={styles.audioElement}>
        Your browser does not support audio playback.
      </audio>
    </Box>
  );
}

export const BoardMessageItem: FC<BoardMessageItemProps> = ({ message }) => {
  const hasActions = (message.canEdit ?? false) || (message.canDelete ?? false);

  return (
    <Box className={`${styles.messageRow} ${message.isOwn ? styles.ownMessageRow : ""}`}>
      {!message.isOwn && (
        <BoardMemberAvatar member={message.avatar} size="small" className={styles.messageAvatar} />
      )}

      <Box className={styles.messageContainer}>
        {message.audio ? (
          <AudioMessage
            duration={message.audio.duration}
            src={message.audio.src}
            waveform={message.audio.waveform}
          />
        ) : message.isEditing ? (
          <Box className={styles.editForm}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              size="small"
              value={message.editDraft ?? ""}
              onChange={(event) => {
                message.onEditChange?.(event.target.value);
              }}
            />

            <Box className={styles.actionRow}>
              <Button
                variant="contained"
                size="small"
                onClick={message.onEditSubmit}
                disabled={!message.editDraft?.trim()}
              >
                Save
              </Button>
              <Button variant="text" size="small" onClick={message.onEditCancel}>
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Box
            className={`${styles.messageBubble} ${message.isOwn ? styles.ownMessageBubble : ""}`}
          >
            {message.text}
          </Box>
        )}

        {!message.isEditing && hasActions && (
          <Box className={styles.actionRow}>
            {message.canEdit && (
              <Button variant="text" size="small" onClick={message.onEditStart}>
                Edit
              </Button>
            )}
            {message.canDelete && (
              <Button variant="text" size="small" color="error" onClick={message.onDelete}>
                Delete
              </Button>
            )}
          </Box>
        )}

        <Typography className={styles.messageTime}>
          {message.time}
          {message.isEdited ? " · Edited" : ""}
          {message.isRead === false ? " · Unread" : ""}
        </Typography>
      </Box>

      {message.isOwn && (
        <BoardMemberAvatar member={message.avatar} size="small" className={styles.messageAvatar} />
      )}
    </Box>
  );
};
