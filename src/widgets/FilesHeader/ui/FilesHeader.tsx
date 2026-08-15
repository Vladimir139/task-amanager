import { Add, Link } from "@mui/icons-material";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import type { ChangeEvent, FC } from "react";
import { useRef, useState } from "react";

import { useUploadFileMutation } from "@/entities/file";
import {
  type FolderColor,
  folderColors,
  useCreateFolderMutation,
  useSelectedFolder,
} from "@/entities/folder";
import { useActiveProject, useGetProjectMembersQuery } from "@/entities/project";
import { selectAuthUser } from "@/entities/user";
import { getApiErrorMessage } from "@/shared/lib/api";
import { useStatusToast } from "@/shared/lib/toast/useStatusToast";
import { useAppSelector } from "@/shared/libs/redux";

import styles from "./FilesHeader.module.scss";

export const FilesHeader: FC = () => {
  const authUser = useAppSelector(selectAuthUser);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "success" | null>(null);
  const [folderName, setFolderName] = useState("");
  const [folderNameError, setFolderNameError] = useState(false);
  const [folderColor, setFolderColor] = useState<(typeof folderColors)[number]>("blue");
  const [createFolder, { isLoading: isCreatingFolder }] = useCreateFolderMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const { selectedFolder, selectedFolderId } = useSelectedFolder();
  const { activeProjectId, currentProjectTitle } = useActiveProject();
  const effectiveProjectId = selectedFolder?.projectId ?? activeProjectId ?? undefined;
  const { data: projectMembers = [] } = useGetProjectMembersQuery(effectiveProjectId ?? "", {
    skip: !effectiveProjectId,
  });
  const currentProjectRole =
    projectMembers.find((member) => member.userId === authUser?.id)?.role ?? null;
  const canWriteFiles = currentProjectRole !== "viewer";

  useStatusToast({ message: statusMessage, tone: statusTone });

  const handleCreateFolder = async (): Promise<void> => {
    if (!canWriteFiles) {
      setStatusMessage("You have view-only access to this project.");
      setStatusTone("error");
      return;
    }

    const trimmedFolderName = folderName.trim();

    if (!trimmedFolderName) {
      setFolderNameError(true);
      return;
    }

    setFolderNameError(false);
    setStatusMessage(null);
    setStatusTone(null);

    try {
      await createFolder({
        color: folderColor,
        name: trimmedFolderName,
        parentId: selectedFolderId ?? undefined,
        projectId: effectiveProjectId,
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
    if (!canWriteFiles) {
      setStatusMessage("You have view-only access to this project.");
      setStatusTone("error");
      event.target.value = "";
      return;
    }

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
            projectId: effectiveProjectId,
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
        <Typography className={styles.contextText}>
          {selectedFolder
            ? `Current folder: ${selectedFolder.name}. New folders and uploads will be added here.`
            : effectiveProjectId
              ? `Current destination: ${currentProjectTitle ?? "Selected project"} root.`
              : "Current destination: workspace root."}
        </Typography>
        {effectiveProjectId && !canWriteFiles && (
          <Typography className={styles.contextText}>
            You have view-only access to this project, file uploads and folder creation are
            disabled.
          </Typography>
        )}
      </Box>

      <Box className={styles.pageActions}>
        <TextField
          value={folderName}
          onChange={(event) => {
            setFolderName(event.target.value);
            if (folderNameError && event.target.value.trim().length > 0) {
              setFolderNameError(false);
            }
          }}
          size="small"
          placeholder="Folder name"
          className={styles.folderNameField}
          error={folderNameError}
          helperText={folderNameError ? "Enter a folder name before creating it." : " "}
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
          disabled={isCreatingFolder || !canWriteFiles}
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
          disabled={isUploading || !canWriteFiles}
        >
          {isUploading ? "Uploading..." : selectedFolder ? "Upload Here" : "Upload"}
        </Button>
      </Box>
    </Box>
  );
};
