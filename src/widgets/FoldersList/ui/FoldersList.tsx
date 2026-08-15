import { ArrowBack, DeleteOutlined, Folder, SaveOutlined } from "@mui/icons-material";
import { Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  type Folder as FolderType,
  FolderCard,
  type FolderColor,
  folderColors,
  mapFolderColor,
  useDeleteFolderMutation,
  useGetFoldersQuery,
  useSelectedFolderId,
  useUpdateFolderMutation,
} from "@/entities/folder";
import { useActiveProject } from "@/entities/project";
import { useGetUsersQuery } from "@/entities/user";
import type { FolderRecord } from "@/shared/api/types";
import { getFilesRoute } from "@/shared/config/router/routes";
import { getApiErrorMessage } from "@/shared/lib/api";
import { getInitials } from "@/shared/lib/formatters";
import { useStatusToast } from "@/shared/lib/toast/useStatusToast";

import styles from "./FoldersList.module.scss";

export const FoldersList: FC = () => {
  const navigate = useNavigate();
  const { activeProjectId, currentProjectTitle } = useActiveProject();
  const selectedFolderId = useSelectedFolderId();
  const { data, isError, isLoading } = useGetFoldersQuery();
  const { data: users } = useGetUsersQuery();
  const [updateFolder, { isLoading: isUpdatingFolder }] = useUpdateFolderMutation();
  const [deleteFolder, { isLoading: isDeletingFolder }] = useDeleteFolderMutation();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "success" | null>(null);
  const [folderName, setFolderName] = useState("");
  const [folderColor, setFolderColor] = useState<(typeof folderColors)[number]>("blue");

  useStatusToast({ message: statusMessage, tone: statusTone });

  const userMap = useMemo(() => new Map((users ?? []).map((user) => [user._id, user])), [users]);

  const mapFolder = useCallback(
    (folder: FolderRecord): FolderType => ({
      color: mapFolderColor(folder.color),
      filesCount: folder.fileCount,
      id: folder._id,
      members:
        folder.memberIds
          ?.slice(0, 2)
          .map((memberId) => userMap.get(memberId))
          .filter(Boolean)
          .map((member) => getInitials(member?.firstName, member?.lastName)) ?? [],
      name: folder.name,
      parentId: folder.parentId ?? null,
      projectId: folder.projectId ?? null,
    }),
    [userMap],
  );

  const folders = useMemo(
    () =>
      data
        ?.filter((folder) => !activeProjectId || folder.projectId === activeProjectId)
        .map(mapFolder) ?? [],
    [activeProjectId, data, mapFolder],
  );

  const foldersById = useMemo(
    () => new Map(folders.map((folder) => [String(folder.id), folder])),
    [folders],
  );

  const selectedFolder = useMemo(() => {
    if (!selectedFolderId) {
      return null;
    }

    return foldersById.get(selectedFolderId) ?? null;
  }, [foldersById, selectedFolderId]);

  const visibleFolders = useMemo(() => {
    const parentId = selectedFolder ? String(selectedFolder.id) : null;

    return folders.filter((folder) => (folder.parentId ?? null) === parentId);
  }, [folders, selectedFolder]);

  const parentFolder = selectedFolder?.parentId
    ? (foldersById.get(selectedFolder.parentId) ?? null)
    : null;

  useEffect(() => {
    if (!selectedFolder) {
      setFolderName("");
      setFolderColor("blue");

      return;
    }

    setFolderName(selectedFolder.name);
    setFolderColor(selectedFolder.color);
  }, [selectedFolder]);

  const handleOpenFolder = (folder: FolderType) => {
    void navigate(
      getFilesRoute(activeProjectId ?? folder.projectId ?? undefined, String(folder.id)),
    );
  };

  const handleGoToAllFiles = () => {
    void navigate(getFilesRoute(activeProjectId ?? undefined));
  };

  const handleGoToParent = () => {
    void navigate(
      getFilesRoute(
        activeProjectId ?? parentFolder?.projectId ?? undefined,
        parentFolder ? String(parentFolder.id) : undefined,
      ),
    );
  };

  const handleSaveFolder = async (): Promise<void> => {
    if (!selectedFolderId || !selectedFolder) {
      return;
    }

    const trimmedFolderName = folderName.trim();
    const hasFolderChanges =
      trimmedFolderName.length > 0 &&
      (trimmedFolderName !== selectedFolder.name || folderColor !== selectedFolder.color);

    if (!hasFolderChanges) {
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await updateFolder({
        color: folderColor,
        folderId: selectedFolderId,
        name: trimmedFolderName,
      }).unwrap();
      setStatusMessage("Folder updated.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getApiErrorMessage(error, "Unable to update the folder."));
      setStatusTone("error");
    }
  };

  const handleDeleteFolder = async (): Promise<void> => {
    if (!selectedFolderId) {
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await deleteFolder(selectedFolderId).unwrap();
      void navigate(
        getFilesRoute(
          activeProjectId ?? parentFolder?.projectId ?? undefined,
          parentFolder ? String(parentFolder.id) : undefined,
        ),
      );
      setStatusMessage("Folder deleted.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getApiErrorMessage(error, "Unable to delete the folder."));
      setStatusTone("error");
    }
  };

  const isFolderDirty = selectedFolder
    ? folderName.trim().length > 0 &&
      (folderName.trim() !== selectedFolder.name || folderColor !== selectedFolder.color)
    : false;

  return (
    <Paper className={styles.foldersSection} elevation={0}>
      <Box className={styles.foldersHeader}>
        <Box className={styles.foldersTitle}>
          <Box className={styles.allFilesIcon}>
            <Folder />
          </Box>

          <Typography>{selectedFolder ? selectedFolder.name : "All Files"}</Typography>
        </Box>

        <Box className={styles.headerActions}>
          {selectedFolder && (
            <Button
              type="button"
              className={styles.showAllButton}
              startIcon={<ArrowBack />}
              onClick={handleGoToParent}
            >
              {parentFolder ? `Back to ${parentFolder.name}` : "Back to All Files"}
            </Button>
          )}

          <Button type="button" className={styles.showAllButton} onClick={handleGoToAllFiles}>
            All Files
          </Button>
        </Box>
      </Box>

      {activeProjectId && (
        <Typography className={styles.scopeText}>
          {selectedFolder
            ? `Showing subfolders inside ${selectedFolder.name} for ${currentProjectTitle ?? "the selected project"}.`
            : `Showing folders for ${currentProjectTitle ?? "the selected project"}.`}
        </Typography>
      )}
      {selectedFolder && (
        <Typography className={styles.scopeText}>
          {visibleFolders.length > 0
            ? "Subfolders in the current folder."
            : "This folder has no subfolders yet."}
        </Typography>
      )}
      {selectedFolder && (
        <Box className={styles.folderEditor}>
          <TextField
            value={folderName}
            onChange={(event) => {
              setFolderName(event.target.value);
            }}
            label="Folder name"
            size="small"
            className={styles.folderNameField}
          />

          <TextField
            select
            value={folderColor}
            onChange={(event) => {
              setFolderColor(event.target.value as FolderColor);
            }}
            label="Color"
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
            startIcon={<SaveOutlined />}
            onClick={() => {
              void handleSaveFolder();
            }}
            disabled={isUpdatingFolder || !isFolderDirty}
          >
            {isUpdatingFolder ? "Saving..." : "Save"}
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlined />}
            onClick={() => {
              void handleDeleteFolder();
            }}
            disabled={isDeletingFolder}
          >
            {isDeletingFolder ? "Deleting..." : "Delete"}
          </Button>
        </Box>
      )}

      {isError && <Typography>Unable to load folders.</Typography>}
      {isLoading && <Typography>Loading folders...</Typography>}
      {selectedFolderId && !selectedFolder && !isLoading && !isError && (
        <Typography>Folder not found.</Typography>
      )}
      {!isLoading &&
        !isError &&
        (!selectedFolderId || Boolean(selectedFolder)) &&
        visibleFolders.length === 0 && (
          <Typography>{selectedFolder ? "No subfolders yet." : "No folders yet."}</Typography>
        )}

      <Box className={styles.foldersGrid}>
        {visibleFolders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            isActive={selectedFolderId === String(folder.id)}
            onClick={handleOpenFolder}
          />
        ))}
      </Box>
    </Paper>
  );
};
