import { CloudUploadOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import type { ChangeEvent, DragEvent, FC } from "react";
import { useRef, useState } from "react";

import { allowedAvatarTypes, maxAvatarFileSize } from "../model/constants";
import styles from "./UploadProfileAvatar.module.scss";

interface UploadProfileAvatarProps {
  onFileSelect: (file: File) => void;
  previewUrl?: string;
  selectedFileName?: string | null;
}

export const UploadProfileAvatar: FC<UploadProfileAvatarProps> = ({
  onFileSelect,
  previewUrl,
  selectedFileName = null,
}) => {
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
      {previewUrl && (
        <Box className={styles.previewBlock}>
          <Box
            component="img"
            src={previewUrl}
            alt="Profile avatar preview"
            className={styles.previewImage}
          />
          <Box>
            <Typography className={styles.previewTitle}>Current avatar</Typography>
            <Typography className={styles.previewSubtitle}>
              {selectedFileName
                ? `Selected: ${selectedFileName}`
                : "Upload a new image to replace it."}
            </Typography>
          </Box>
        </Box>
      )}

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

        <Typography>
          {previewUrl ? "Click to replace or drag and drop" : "Click to upload or drag and drop"}
        </Typography>

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
