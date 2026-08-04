import { CloudUploadOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import type { ChangeEvent, DragEvent, FC } from "react";
import { useRef, useState } from "react";

import { allowedAvatarTypes, maxAvatarFileSize } from "../model/constants";
import styles from "./UploadProfileAvatar.module.scss";

interface UploadProfileAvatarProps {
  onFileSelect: (file: File) => void;
}

export const UploadProfileAvatar: FC<UploadProfileAvatarProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndSelectFile = (file: File) => {
    if (!allowedAvatarTypes.includes(file.type as (typeof allowedAvatarTypes)[number])) {
      setError("Unsupported image format.");
      return;
    }

    if (file.size > maxAvatarFileSize) {
      setError("The image must not exceed 5 MB.");
      return;
    }

    setError(null);
    onFileSelect(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    validateAndSelectFile(file);

    event.target.value = "";
  };

  const handleDragOver = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];

    if (!file) {
      return;
    }

    validateAndSelectFile(file);
  };

  return (
    <Box className={styles.uploadField}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".svg,.png,.jpg,.jpeg,.gif"
        hidden
        onChange={handleFileChange}
      />

      <button
        type="button"
        className={`${styles.uploadArea} ${isDragging ? styles.dragging : ""}`}
        onClick={() => {
          fileInputRef.current?.click();
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Box className={styles.uploadIcon}>
          <CloudUploadOutlined />
        </Box>

        <Typography>Click to upload or drag and drop</Typography>

        <Typography>SVG, PNG, JPG or GIF, up to 5 MB</Typography>
      </button>

      {error && (
        <Typography className={styles.error} role="alert">
          {error}
        </Typography>
      )}
    </Box>
  );
};
