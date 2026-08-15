import { Box, Button, Paper, Typography } from "@mui/material";
import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";

import {
  type RecentFile,
  RecentFileRow,
  useDeleteFileMutation,
  useGetRecentFilesQuery,
} from "@/entities/file";
import { useGetUsersQuery } from "@/entities/user";
import { formatBytes, formatDateLabel, getInitials } from "@/shared/lib/formatters";
import { AppModal } from "@/shared/ui/molecules/AppModal/AppModal";

import { getSortValue } from "../lib/helpers";
import { TableHeaderButton } from "../lib/ui";
import type { RecentFilesSortField, SortDirection } from "../model/types";
import styles from "./RecentFiles.module.scss";

const mapFileType = (kind: string): RecentFile["type"] => {
  if (
    [
      "document",
      "image",
      "figma",
      "illustrator",
      "audio",
      "video",
      "sketch",
      "xd",
      "svg",
      "other",
    ].includes(kind)
  ) {
    return kind as RecentFile["type"];
  }

  return "other";
};

export const RecentFiles: FC = () => {
  const [sortField, setSortField] = useState<RecentFilesSortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [pendingDeleteFile, setPendingDeleteFile] = useState<RecentFile | null>(null);
  const {
    data = [],
    isError,
    isLoading,
  } = useGetRecentFilesQuery(
    sortField === "members"
      ? undefined
      : {
          order: sortDirection,
          sort: sortField,
        },
  );
  const { data: users } = useGetUsersQuery();
  const [deleteFile] = useDeleteFileMutation();
  const isDeleteConfirmLoading = deletingFileId === pendingDeleteFile?.id;

  const handleDeleteFile = useCallback(
    async (fileId: string): Promise<void> => {
      setDeletingFileId(fileId);

      try {
        await deleteFile(fileId).unwrap();
      } finally {
        setDeletingFileId(null);
      }
    },
    [deleteFile],
  );

  const recentFiles = useMemo(() => {
    const userMap = new Map((users ?? []).map((user) => [user._id, user]));

    return data.map((file) => {
      const uploader = userMap.get(file.uploadedBy);
      const folderName = file.folderName?.trim() ? file.folderName.trim() : null;
      const projectTitle = file.projectTitle?.trim() ? file.projectTitle.trim() : null;
      const locationLabel = projectTitle
        ? folderName
          ? `Project: ${projectTitle}`
          : `Project root: ${projectTitle}`
        : "Workspace root";

      return {
        folderName: folderName ?? "—",
        id: file._id,
        isDeleting: deletingFileId === file._id,
        lastModified: formatDateLabel(file.updatedAt ?? file.createdAt),
        locationLabel,
        members: uploader ? [getInitials(uploader.firstName, uploader.lastName)] : ["TM"],
        name: file.originalName,
        onDelete: () => {
          setPendingDeleteFile({
            folderName: folderName ?? "—",
            id: file._id,
            isDeleting: deletingFileId === file._id,
            lastModified: formatDateLabel(file.updatedAt ?? file.createdAt),
            locationLabel,
            members: uploader ? [getInitials(uploader.firstName, uploader.lastName)] : ["TM"],
            name: file.originalName,
            openUrl: file.downloadUrl ?? file.previewUrl ?? undefined,
            size: formatBytes(file.size),
            type: mapFileType(file.kind),
          });
        },
        openUrl: file.downloadUrl ?? file.previewUrl ?? undefined,
        size: formatBytes(file.size),
        type: mapFileType(file.kind),
      } satisfies RecentFile;
    });
  }, [data, deletingFileId, users]);

  const sortedFiles = useMemo(() => {
    if (sortField !== "members") {
      return recentFiles;
    }

    return [...recentFiles].sort((firstFile, secondFile) => {
      const firstValue = getSortValue(firstFile, sortField);
      const secondValue = getSortValue(secondFile, sortField);

      const result =
        typeof firstValue === "number" && typeof secondValue === "number"
          ? firstValue - secondValue
          : String(firstValue).localeCompare(String(secondValue));

      return sortDirection === "asc" ? result : -result;
    });
  }, [recentFiles, sortDirection, sortField]);

  const handleSort = (field: RecentFilesSortField) => {
    if (field === sortField) {
      setSortDirection((currentDirection) => (currentDirection === "asc" ? "desc" : "asc"));

      return;
    }

    setSortField(field);
    setSortDirection("asc");
  };

  return (
    <Paper className={styles.recentSection} elevation={0}>
      <Box className={styles.recentHeader}>
        <Typography component="h2">Files</Typography>

        <Typography>{sortedFiles.length} items</Typography>
      </Box>

      {isError && <Typography>Unable to load files.</Typography>}
      {isLoading && <Typography>Loading files...</Typography>}
      {!isLoading && !isError && sortedFiles.length === 0 && <Typography>No files yet.</Typography>}

      <Box className={styles.tableWrapper}>
        <Box className={styles.tableHeader}>
          <TableHeaderButton
            field="name"
            label="Name"
            activeField={sortField}
            direction={sortDirection}
            onSort={handleSort}
          />
          <Typography component="span">Folder</Typography>
          <TableHeaderButton
            field="size"
            label="Size"
            activeField={sortField}
            direction={sortDirection}
            onSort={handleSort}
          />
          <TableHeaderButton
            field="lastModified"
            label="Last Modified"
            activeField={sortField}
            direction={sortDirection}
            onSort={handleSort}
          />
          <TableHeaderButton
            field="members"
            label="Members"
            activeField={sortField}
            direction={sortDirection}
            onSort={handleSort}
          />
          <span />
        </Box>

        <Box className={styles.filesList}>
          {sortedFiles.map((file) => (
            <RecentFileRow key={file.id} file={file} />
          ))}
        </Box>
      </Box>

      <AppModal
        open={pendingDeleteFile != null}
        onClose={() => {
          if (!deletingFileId) {
            setPendingDeleteFile(null);
          }
        }}
        title="Delete file"
        footer={
          <>
            <Button
              variant="text"
              onClick={() => {
                setPendingDeleteFile(null);
              }}
              disabled={isDeleteConfirmLoading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              disableElevation
              onClick={() => {
                if (!pendingDeleteFile) {
                  return;
                }

                void handleDeleteFile(String(pendingDeleteFile.id)).then(() => {
                  setPendingDeleteFile(null);
                });
              }}
              disabled={isDeleteConfirmLoading}
            >
              {isDeleteConfirmLoading ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      >
        <Typography>
          {pendingDeleteFile
            ? `Delete ${pendingDeleteFile.name}? This action cannot be undone.`
            : ""}
        </Typography>
      </AppModal>
    </Paper>
  );
};
