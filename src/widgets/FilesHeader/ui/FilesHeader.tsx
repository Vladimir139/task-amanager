import { Add, Link } from "@mui/icons-material";
import { Alert, Box, Button, Typography } from "@mui/material";
import type { ChangeEvent, FC } from "react";
import { useRef, useState } from "react";

import { useUploadFileMutation } from "@/entities/file";
import { useCreateFolderMutation } from "@/entities/folder";

import styles from "./FilesHeader.module.scss";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (!error || typeof error !== "object" || !("data" in error)) {
    return fallback;
  }

  const data = error.data as { message?: string | string[] };
  if (Array.isArray(data.message)) {
    return data.message[0] ?? fallback;
  }

  return data.message ?? fallback;
};

export const FilesHeader: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "success" | null>(null);
  const [createFolder, { isLoading: isCreatingFolder }] = useCreateFolderMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const handleCreateFolder = async (): Promise<void> => {
    const name = window.prompt("Folder name");

    if (!name?.trim()) {
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await createFolder({ color: "blue", name: name.trim() }).unwrap();
      setStatusMessage("Folder created.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Unable to create the folder."));
      setStatusTone("error");
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await Promise.all(
        selectedFiles.map(async (file) =>
          uploadFile({
            file,
          }).unwrap(),
        ),
      );

      setStatusMessage(
        selectedFiles.length === 1
          ? "File uploaded successfully."
          : `${selectedFiles.length} files uploaded successfully.`,
      );
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Unable to upload selected files."));
      setStatusTone("error");
    }

    event.target.value = "";
  };

  return (
    <Box className={styles.pageHeader}>
      <Box>
        <Typography component="h1">Files</Typography>
        {statusMessage && statusTone && <Alert severity={statusTone}>{statusMessage}</Alert>}
      </Box>

      <Box className={styles.pageActions}>
        <Button
          variant="contained"
          disableElevation
          startIcon={<Add />}
          className={styles.createFolderButton}
          onClick={() => {
            void handleCreateFolder();
          }}
          disabled={isCreatingFolder}
        >
          {isCreatingFolder ? "Creating..." : "Create New Folder"}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          multiple
          onChange={(event) => void handleUpload(event)}
        />

        <Button
          variant="outlined"
          startIcon={<Link />}
          className={styles.uploadButton}
          onClick={handleUploadButtonClick}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </Box>
    </Box>
  );
};
