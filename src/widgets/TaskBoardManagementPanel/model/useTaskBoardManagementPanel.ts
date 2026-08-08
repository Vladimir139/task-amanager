import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useCreateBoardColumnMutation,
  useDeleteBoardColumnMutation,
  useReorderBoardColumnsMutation,
  useUpdateBoardColumnMutation,
} from "@/features/boardColumns";
import {
  useCreateBoardMutation,
  useDeleteBoardMutation,
  useUpdateBoardMutation,
} from "@/features/boardCrud";
import { type BoardColumnRecord, type BoardRecord, type TaskRecord } from "@/shared/api/types";
import { getTasksRoute } from "@/shared/config/router";

interface BoardFormState {
  description: string;
  emoji: string;
  title: string;
}

interface ColumnDraftState {
  color: string;
  deleteTargetColumnId: string;
  title: string;
}

interface UseTaskBoardManagementPanelProps {
  board: BoardRecord;
  boards: BoardRecord[];
  canManageBoard: boolean;
  columns: BoardColumnRecord[];
  projectId: string;
  tasksByColumn: Record<string, TaskRecord[]>;
}

interface ColumnItem {
  color: string;
  deleteTargetColumnId: string;
  deleteTargetOptions: Array<{ id: string; title: string }>;
  id: string;
  isDefault: boolean;
  isLocked: boolean;
  kind: "custom" | "system";
  taskCount: number;
  title: string;
}

interface UseTaskBoardManagementPanelResult {
  boardForm: BoardFormState;
  canDeleteBoard: boolean;
  canManageBoard: boolean;
  columnItems: ColumnItem[];
  createBoardForm: BoardFormState;
  handleBoardFieldChange: (
    field: keyof BoardFormState,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleColumnDelete: (columnId: string) => Promise<void>;
  handleColumnFieldChange: (
    columnId: string,
    field: keyof ColumnDraftState,
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
  handleColumnMove: (columnId: string, direction: "left" | "right") => Promise<void>;
  handleColumnSave: (columnId: string) => Promise<void>;
  handleCreateBoard: () => Promise<void>;
  handleCreateBoardFieldChange: (
    field: keyof BoardFormState,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCreateColumn: () => Promise<void>;
  handleDeleteBoard: () => Promise<void>;
  handleNewColumnColorChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleNewColumnTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSaveBoard: () => Promise<void>;
  isMutating: boolean;
  newColumnColor: string;
  newColumnTitle: string;
  statusMessage: string | null;
  statusTone: "error" | "success" | null;
}

const initialBoardForm: BoardFormState = {
  description: "",
  emoji: "",
  title: "",
};

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

const normalizeOptionalValue = (value: string): string | undefined => {
  const normalized = value.trim();

  return normalized || undefined;
};

export const useTaskBoardManagementPanel = ({
  board,
  boards,
  canManageBoard,
  columns,
  projectId,
  tasksByColumn,
}: UseTaskBoardManagementPanelProps): UseTaskBoardManagementPanelResult => {
  const navigate = useNavigate();
  const [boardForm, setBoardForm] = useState<BoardFormState>(initialBoardForm);
  const [createBoardForm, setCreateBoardForm] = useState<BoardFormState>(initialBoardForm);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [newColumnColor, setNewColumnColor] = useState("");
  const [columnDrafts, setColumnDrafts] = useState<Record<string, ColumnDraftState>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "success" | null>(null);

  const [createBoard, { isLoading: isCreatingBoard }] = useCreateBoardMutation();
  const [updateBoard, { isLoading: isUpdatingBoard }] = useUpdateBoardMutation();
  const [deleteBoard, { isLoading: isDeletingBoard }] = useDeleteBoardMutation();
  const [createBoardColumn, { isLoading: isCreatingColumn }] = useCreateBoardColumnMutation();
  const [updateBoardColumn, { isLoading: isUpdatingColumn }] = useUpdateBoardColumnMutation();
  const [reorderBoardColumns, { isLoading: isReorderingColumns }] =
    useReorderBoardColumnsMutation();
  const [deleteBoardColumn, { isLoading: isDeletingColumn }] = useDeleteBoardColumnMutation();

  useEffect(() => {
    setBoardForm({
      description: board.description ?? "",
      emoji: board.emoji ?? "",
      title: board.title,
    });
    setStatusMessage(null);
    setStatusTone(null);
  }, [board.description, board.emoji, board.title]);

  useEffect(() => {
    setColumnDrafts(
      Object.fromEntries(
        columns.map((column) => {
          const fallbackDeleteTargetId =
            columns.find((candidate) => candidate._id !== column._id)?._id ?? "";

          return [
            column._id,
            {
              color: column.color ?? "",
              deleteTargetColumnId: fallbackDeleteTargetId,
              title: column.title,
            },
          ];
        }),
      ),
    );
  }, [columns]);

  const columnItems = useMemo<ColumnItem[]>(() => {
    return columns.map((column) => {
      const draft = columnDrafts[column._id];
      const taskCount = tasksByColumn[column._id]?.length ?? 0;

      return {
        color: draft?.color ?? column.color ?? "",
        deleteTargetColumnId: draft?.deleteTargetColumnId ?? "",
        deleteTargetOptions: columns
          .filter((candidate) => candidate._id !== column._id)
          .map((candidate) => ({
            id: candidate._id,
            title: candidate.title,
          })),
        id: column._id,
        isDefault: Boolean(board.isDefault),
        isLocked: column.isLocked ?? false,
        kind: column.kind,
        taskCount,
        title: draft?.title ?? column.title,
      };
    });
  }, [board.isDefault, columnDrafts, columns, tasksByColumn]);

  const isMutating =
    isCreatingBoard ||
    isUpdatingBoard ||
    isDeletingBoard ||
    isCreatingColumn ||
    isUpdatingColumn ||
    isReorderingColumns ||
    isDeletingColumn;

  const canDeleteBoard = !board.isDefault;

  const handleBoardFieldChange =
    (field: keyof BoardFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setBoardForm((currentState) => ({
        ...currentState,
        [field]: event.target.value,
      }));
    };

  const handleCreateBoardFieldChange =
    (field: keyof BoardFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setCreateBoardForm((currentState) => ({
        ...currentState,
        [field]: event.target.value,
      }));
    };

  const handleNewColumnTitleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setNewColumnTitle(event.target.value);
  };

  const handleNewColumnColorChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setNewColumnColor(event.target.value);
  };

  const handleColumnFieldChange =
    (columnId: string, field: keyof ColumnDraftState) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      setColumnDrafts((currentState) => ({
        ...currentState,
        [columnId]: {
          ...(currentState[columnId] ?? {
            color: "",
            deleteTargetColumnId: "",
            title: "",
          }),
          [field]: event.target.value,
        },
      }));
    };

  const handleCreateBoard = async (): Promise<void> => {
    const title = createBoardForm.title.trim();

    if (!title) {
      setStatusMessage("Board title is required.");
      setStatusTone("error");
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      const createdBoard = await createBoard({
        description: normalizeOptionalValue(createBoardForm.description),
        emoji: normalizeOptionalValue(createBoardForm.emoji),
        projectId,
        title,
      }).unwrap();

      setCreateBoardForm(initialBoardForm);
      await navigate(getTasksRoute(projectId, createdBoard._id));
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Unable to create the board."));
      setStatusTone("error");
    }
  };

  const handleSaveBoard = async (): Promise<void> => {
    const title = boardForm.title.trim();

    if (!title) {
      setStatusMessage("Board title is required.");
      setStatusTone("error");
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await updateBoard({
        boardId: board._id,
        description: normalizeOptionalValue(boardForm.description),
        emoji: normalizeOptionalValue(boardForm.emoji),
        projectId,
        title,
      }).unwrap();

      setStatusMessage("Board details updated.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Unable to update the board."));
      setStatusTone("error");
    }
  };

  const handleDeleteBoard = async (): Promise<void> => {
    if (!canDeleteBoard) {
      setStatusMessage("Default boards cannot be deleted.");
      setStatusTone("error");
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await deleteBoard({
        boardId: board._id,
        projectId,
      }).unwrap();

      const nextBoardId =
        boards.find((item) => item._id !== board._id && item.isDefault)?._id ??
        boards.find((item) => item._id !== board._id)?._id;

      await navigate(getTasksRoute(projectId, nextBoardId));
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Unable to delete the board."));
      setStatusTone("error");
    }
  };

  const handleCreateColumn = async (): Promise<void> => {
    const title = newColumnTitle.trim();

    if (!title) {
      setStatusMessage("Column title is required.");
      setStatusTone("error");
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await createBoardColumn({
        boardId: board._id,
        color: normalizeOptionalValue(newColumnColor),
        projectId,
        title,
      }).unwrap();

      setNewColumnTitle("");
      setNewColumnColor("");
      setStatusMessage("Board column created.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Unable to create the board column."));
      setStatusTone("error");
    }
  };

  const handleColumnSave = async (columnId: string): Promise<void> => {
    const draft = columnDrafts[columnId];
    const title = draft?.title.trim();

    if (!title) {
      setStatusMessage("Column title is required.");
      setStatusTone("error");
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await updateBoardColumn({
        boardId: board._id,
        color: normalizeOptionalValue(draft.color),
        columnId,
        projectId,
        title,
      }).unwrap();

      setStatusMessage("Board column updated.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Unable to update the board column."));
      setStatusTone("error");
    }
  };

  const handleColumnMove = async (columnId: string, direction: "left" | "right"): Promise<void> => {
    const currentIndex = columns.findIndex((column) => column._id === columnId);
    const targetIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= columns.length) {
      return;
    }

    const reorderedColumns = [...columns];
    const [movedColumn] = reorderedColumns.splice(currentIndex, 1);
    reorderedColumns.splice(targetIndex, 0, movedColumn);

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await reorderBoardColumns({
        boardId: board._id,
        items: reorderedColumns.map((column, index) => ({
          columnId: column._id,
          position: index,
        })),
        projectId,
      }).unwrap();

      setStatusMessage("Board columns reordered.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Unable to reorder board columns."));
      setStatusTone("error");
    }
  };

  const handleColumnDelete = async (columnId: string): Promise<void> => {
    const draft = columnDrafts[columnId];
    const taskCount = tasksByColumn[columnId]?.length ?? 0;

    if (taskCount > 0 && !draft?.deleteTargetColumnId) {
      setStatusMessage("Choose a target column before deleting a non-empty column.");
      setStatusTone("error");
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await deleteBoardColumn({
        boardId: board._id,
        columnId,
        projectId,
        targetColumnId: taskCount > 0 ? draft.deleteTargetColumnId : undefined,
      }).unwrap();

      setStatusMessage("Board column deleted.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Unable to delete the board column."));
      setStatusTone("error");
    }
  };

  return {
    boardForm,
    canDeleteBoard,
    canManageBoard,
    columnItems,
    createBoardForm,
    handleBoardFieldChange,
    handleColumnDelete,
    handleColumnFieldChange,
    handleColumnMove,
    handleColumnSave,
    handleCreateBoard,
    handleCreateBoardFieldChange,
    handleCreateColumn,
    handleDeleteBoard,
    handleNewColumnColorChange,
    handleNewColumnTitleChange,
    handleSaveBoard,
    isMutating,
    newColumnColor,
    newColumnTitle,
    statusMessage,
    statusTone,
  };
};
