import { useMemo } from "react";

import type { FolderRecord } from "@/shared/api/types";

import { useGetFoldersQuery } from "../../api/foldersApi";
import { useSelectedFolderId } from "./useSelectedFolderId";

interface UseSelectedFolderResult {
  isError: boolean;
  isLoading: boolean;
  selectedFolder: FolderRecord | null;
  selectedFolderId: string | null;
}

export const useSelectedFolder = (): UseSelectedFolderResult => {
  const selectedFolderId = useSelectedFolderId();
  const { data, isError, isLoading } = useGetFoldersQuery();

  const selectedFolder = useMemo(
    () =>
      selectedFolderId ? (data?.find((folder) => folder._id === selectedFolderId) ?? null) : null,
    [data, selectedFolderId],
  );

  return {
    isError,
    isLoading,
    selectedFolder,
    selectedFolderId,
  };
};
