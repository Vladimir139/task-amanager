import { Pause } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import type { FC } from "react";

import { BoardMemberAvatar } from "@/entities/boardMember";

import type { BoardAudioMessage, BoardMessageItemProps } from "../../model/types.ts";
import styles from "./BoardMessageItem.module.scss";

function AudioMessage({ duration, waveform }: BoardAudioMessage) {
  return (
    <Box className={styles.audioMessage}>
      <IconButton aria-label="Pause audio message">
        <Pause />
      </IconButton>

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

      <Typography>{duration}</Typography>
    </Box>
  );
}

export const BoardMessageItem: FC<BoardMessageItemProps> = ({ message }) => {
  return (
    <Box className={`${styles.messageRow} ${message.isOwn ? styles.ownMessageRow : ""}`}>
      {!message.isOwn && (
        <BoardMemberAvatar member={message.avatar} size="small" className={styles.messageAvatar} />
      )}

      <Box className={styles.messageContainer}>
        {message.audio ? (
          <AudioMessage duration={message.audio.duration} waveform={message.audio.waveform} />
        ) : (
          <Box
            className={`${styles.messageBubble} ${message.isOwn ? styles.ownMessageBubble : ""}`}
          >
            {message.text}
          </Box>
        )}

        <Typography className={styles.messageTime}>{message.time}</Typography>
      </Box>

      {message.isOwn && (
        <BoardMemberAvatar member={message.avatar} size="small" className={styles.messageAvatar} />
      )}
    </Box>
  );
};
