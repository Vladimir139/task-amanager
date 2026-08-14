import { AttachFileOutlined, MicNone, SendOutlined } from "@mui/icons-material";
import { Box, IconButton, TextField } from "@mui/material";
import type { ChangeEvent, FC, KeyboardEvent } from "react";

import styles from "../ChatWindow/ChatWindow.module.scss";

interface MessageComposerProps {
  isDisabled?: boolean;
  isSubmitting?: boolean;
  onAttachImages: (files: FileList | null) => void;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onUploadAudio: (files: FileList | null) => void;
  value: string;
}

export const MessageComposer: FC<MessageComposerProps> = ({
  isDisabled = false,
  isSubmitting = false,
  onAttachImages,
  value,
  onChange,
  onSubmit,
  onUploadAudio,
}) => {
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
      <IconButton component="label" aria-label="Upload audio" disabled={isSubmitting || isDisabled}>
        <MicNone />
        <input
          hidden
          type="file"
          accept="audio/*"
          onChange={(event) => {
            onUploadAudio(event.target.files);
            event.target.value = "";
          }}
        />
      </IconButton>

      <TextField
        fullWidth
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Write a message..."
        disabled={isDisabled}
        slotProps={{
          htmlInput: {
            "aria-label": "New message",
          },
        }}
      />

      <IconButton component="label" aria-label="Attach files" disabled={isSubmitting || isDisabled}>
        <AttachFileOutlined />
        <input
          hidden
          multiple
          type="file"
          onChange={(event) => {
            onAttachImages(event.target.files);
            event.target.value = "";
          }}
        />
      </IconButton>

      <IconButton
        aria-label="Send message"
        onClick={onSubmit}
        disabled={isSubmitting || isDisabled}
      >
        <SendOutlined />
      </IconButton>
    </Box>
  );
};
