import { Add, Link } from "@mui/icons-material";
import { Alert, Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import type { ChangeEvent, FC } from "react";
import { useRef, useState } from "react";

import { useUploadFileMutation } from "@/entities/file";
import {
  type FolderColor,
  folderColors,
  useCreateFolderMutation,
  useSelectedFolder,
} from "@/entities/folder";
import { useSelectedProjectId } from "@/entities/project";
import { getApiErrorMessage } from "@/shared/lib/api";

import styles from "./FilesHeader.module.scss";

export const FilesHeader: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedProjectId = useSelectedProjectId();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "success" | null>(null);
  const [folderName, setFolderName] = useState("");
  const [folderColor, setFolderColor] = useState<(typeof folderColors)[number]>("blue");
  const [createFolder, { isLoading: isCreatingFolder }] = useCreateFolderMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const { selectedFolder, selectedFolderId } = useSelectedFolder();

  const handleCreateFolder = async (): Promise<void> => {
    const trimmedFolderName = folderName.trim();

    if (!trimmedFolderName) {
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await createFolder({
        color: folderColor,
        name: trimmedFolderName,
        parentId: selectedFolderId ?? undefined,
        projectId: selectedProjectId ?? undefined,
      }).unwrap();
      setFolderName("");
      setFolderColor("blue");
      setStatusMessage(
        selectedFolder ? `Folder created inside ${selectedFolder.name}.` : "Folder created.",
      );
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getApiErrorMessage(error, "Unable to create the folder."));
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
            folderId: selectedFolderId ?? undefined,
            projectId: selectedProjectId ?? undefined,
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
      setStatusMessage(getApiErrorMessage(error, "Unable to upload selected files."));
      setStatusTone("error");
    }

    event.target.value = "";
  };

  return (
    <Box className={styles.pageHeader}>
      <Box>
        <Typography component="h1">Files</Typography>
        {statusMessage && statusTone && <Alert severity={statusTone}>{statusMessage}</Alert>}
        <Typography className={styles.contextText}>
          {selectedFolder
            ? `Uploads and new folders will be added to ${selectedFolder.name}.`
            : selectedProjectId
              ? "Working inside the selected project."
              : "Create folders and upload files for your workspace."}
        </Typography>
      </Box>

      <Box className={styles.pageActions}>
        <TextField
          value={folderName}
          onChange={(event) => {
            setFolderName(event.target.value);
          }}
          size="small"
          placeholder="Folder name"
          className={styles.folderNameField}
        />

        <TextField
          select
          value={folderColor}
          onChange={(event) => {
            setFolderColor(event.target.value as FolderColor);
          }}
          size="small"
          className={styles.folderColorField}
        >
          {folderColors.map((color) => (
            <MenuItem key={color} value={color}>
              {color}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          disableElevation
          startIcon={<Add />}
          className={styles.createFolderButton}
          onClick={() => {
            void handleCreateFolder();
          }}
          disabled={isCreatingFolder || folderName.trim().length === 0}
        >
          {isCreatingFolder ? "Creating..." : "Create Folder"}
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
