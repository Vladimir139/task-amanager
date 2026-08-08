import type { BoardColumnRecord } from "@/shared/api/types";

export const getBoardProjectTagId = (projectId: string): string => `project:${projectId}`;

export const getBoardTagId = (boardId: string): string => `board:${boardId}`;

export const getPreferredBoardColumnId = (columns?: BoardColumnRecord[] | null): string | null => {
  if (!columns?.length) {
    return null;
  }

  return columns.find((column) => column.systemKey === "todo")?._id ?? columns[0]?._id ?? null;
};
