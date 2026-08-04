import {
  ImageOutlined,
  LocationOn,
  MicNone,
  SendOutlined,
  SentimentSatisfiedAlt,
} from "@mui/icons-material";
import { Box, IconButton, TextField } from "@mui/material";
import type { ChangeEvent, FC, KeyboardEvent } from "react";

import styles from "../ChatWindow/ChatWindow.module.scss";

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export const MessageComposer: FC<MessageComposerProps> = ({ value, onChange, onSubmit }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    onSubmit();
  };

  return (
    <Box className={styles.messageComposer}>
      <MicNone />

      <TextField
        fullWidth
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Add a comment..."
        slotProps={{
          htmlInput: {
            "aria-label": "New message",
          },
        }}
      />

      <IconButton aria-label="Attach image">
        <ImageOutlined />
      </IconButton>

      <IconButton aria-label="Select emoji">
        <SentimentSatisfiedAlt />
      </IconButton>

      <IconButton aria-label="Send message" onClick={onSubmit}>
        <SendOutlined />
      </IconButton>

      <IconButton aria-label="Share location">
        <LocationOn />
      </IconButton>
    </Box>
  );
};
