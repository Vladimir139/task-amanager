import { Add, Link } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import type { ChangeEvent, FC } from "react";
import { useRef } from "react";

import { useUploadFileMutation } from "@/entities/file";
import { useCreateFolderMutation } from "@/entities/folder";

import styles from "./FilesHeader.module.scss";

export const FilesHeader: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createFolder, { isLoading: isCreatingFolder }] = useCreateFolderMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const handleCreateFolder = async () => {
    const name = window.prompt("Folder name");

    if (!name?.trim()) {
      return;
    }

    await createFolder({ color: "blue", name: name.trim() });
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    await Promise.all(
      selectedFiles.map(async (file) =>
        uploadFile({
          file,
        }).unwrap(),
      ),
    );

    event.target.value = "";
  };

  return (
    <Box className={styles.pageHeader}>
      <Typography component="h1">Files</Typography>

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
