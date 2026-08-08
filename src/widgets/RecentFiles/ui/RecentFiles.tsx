import { Box, Paper, Typography } from "@mui/material";
import type { FC } from "react";
import { useMemo, useState } from "react";

import { type RecentFile, RecentFileRow, useGetRecentFilesQuery } from "@/entities/file";
import { useGetUsersQuery } from "@/entities/user";
import { formatBytes, formatDateLabel, getInitials } from "@/shared/lib/formatters";

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
  const { data, isError, isLoading } = useGetRecentFilesQuery();
  const { data: users } = useGetUsersQuery();

  const recentFiles = useMemo(() => {
    const userMap = new Map((users ?? []).map((user) => [user._id, user]));

    return (
      data?.map((file) => {
        const uploader = userMap.get(file.uploadedBy);

        return {
          id: file._id,
          lastModified: formatDateLabel(file.updatedAt ?? file.createdAt),
          members: uploader ? [getInitials(uploader.firstName, uploader.lastName)] : ["TM"],
          name: file.originalName,
          size: formatBytes(file.size),
          type: mapFileType(file.kind),
        } satisfies RecentFile;
      }) ?? []
    );
  }, [data, users]);

  const sortedFiles = useMemo(() => {
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
        <Typography component="h2">Recent File</Typography>

        <button type="button">View All</button>
      </Box>

      {isError && <Typography>Unable to load files.</Typography>}
      {isLoading && <Typography>Loading files...</Typography>}

      <Box className={styles.tableWrapper}>
        <Box className={styles.tableHeader}>
          <TableHeaderButton
            field="name"
            label="Name"
            activeField={sortField}
            direction={sortDirection}
            onSort={handleSort}
          />
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
    </Paper>
  );
};
