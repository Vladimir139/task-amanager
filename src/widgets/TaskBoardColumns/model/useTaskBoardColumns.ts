import type { ChangeEvent, DragEvent, MouseEvent } from "react";
import { useMemo, useState } from "react";

import {
  useDeleteBoardColumnMutation,
  useReorderBoardColumnsMutation,
  useUpdateBoardColumnMutation,
} from "@/features/boardColumns";
import { useMoveTaskMutation } from "@/features/moveTask";
import { useUpdateTaskMutation } from "@/features/updateTask";
import type { BoardColumnRecord, TaskRecord } from "@/shared/api/types";
import { getApiErrorMessage } from "@/shared/lib/api";

interface UseTaskBoardColumnsProps {
  boardId: string;
  canManageBoard: boolean;
  canManageTasks: boolean;
  columnRecords: BoardColumnRecord[];
  projectId: string;
  tasksByColumn: Record<string, TaskRecord[]>;
}

type ColumnMenuAction = "edit" | "delete";
type ColumnDropPosition = "before" | "after";
type TaskDropPosition = "before" | "after";
type ColumnTaskDropPosition = "top" | "bottom";

interface UseTaskBoardColumnsResult {
  activeColumnDropId: string | null;
  activeColumnDropPosition: ColumnDropPosition | null;
  activeColumnTaskDropPosition: ColumnTaskDropPosition | null;
  activeTaskDropKey: string | null;
  confirmDeleteAnchor: HTMLElement | null;
  confirmDeleteColumn: BoardColumnRecord | null;
  deleteTargetColumnId: string;
  draggedColumnId: string | null;
  draggedTaskId: string | null;
  editingColor: string;
  editingColumnId: string | null;
  editingTitle: string;
  handleCancelColumnEdit: () => void;
  handleColumnDeleteTargetChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleColumnDragEnd: () => void;
  handleColumnDragOver: (event: DragEvent<HTMLElement>, targetColumnId: string) => void;
  handleColumnDragStart: (event: DragEvent<HTMLElement>, columnId: string) => void;
  handleColumnDrop: (event: DragEvent<HTMLElement>, targetColumnId: string) => Promise<void>;
  handleColumnMenuAction: (action: ColumnMenuAction) => void;
  handleColumnMenuClose: () => void;
  handleColumnMenuOpen: (event: MouseEvent<HTMLElement>, columnId: string) => void;
  handleConfirmDelete: () => Promise<void>;
  handleDeleteCancel: () => void;
  handleEditColorChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleEditTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSaveColumnEdit: () => Promise<void>;
  handleTaskDragEnd: () => void;
  handleTaskDragOver: (event: DragEvent<HTMLElement>, columnId: string, taskId?: string) => void;
  handleTaskDragStart: (
    event: DragEvent<HTMLElement>,
    sourceColumnId: string,
    taskId: string,
  ) => void;
  handleTaskToggleCompleted: (taskId: string, columnId: string) => Promise<void>;
  handleTaskDropOnColumn: (event: DragEvent<HTMLElement>, targetColumnId: string) => Promise<void>;
  handleTaskDropOnTask: (
    event: DragEvent<HTMLElement>,
    targetColumnId: string,
    targetTaskId: string,
  ) => Promise<void>;
  isColumnBeingEdited: (columnId: string) => boolean;
  isDeleteDisabled: boolean;
  isMutating: boolean;
  isTaskDraggable: (taskId: string, columnId: string) => boolean;
  menuAnchor: HTMLElement | null;
  menuColumnId: string | null;
  statusMessage: string | null;
  statusTone: "error" | "success" | null;
}

interface DraggedTaskState {
  sourceColumnId: string;
  taskId: string;
}

const normalizeOptionalValue = (value: string): string | undefined => {
  const normalizedValue = value.trim();

  return normalizedValue || undefined;
};

const getSortedColumns = (columnRecords: BoardColumnRecord[]): BoardColumnRecord[] =>
  [...columnRecords].sort(
    (firstColumn, secondColumn) => firstColumn.position - secondColumn.position,
  );

export const useTaskBoardColumns = ({
  boardId,
  canManageBoard,
  canManageTasks,
  columnRecords,
  projectId,
  tasksByColumn,
}: UseTaskBoardColumnsProps): UseTaskBoardColumnsResult => {
  const [moveTask, { isLoading: isMovingTask }] = useMoveTaskMutation();
  const [updateTask, { isLoading: isUpdatingTask }] = useUpdateTaskMutation();
  const [reorderBoardColumns, { isLoading: isReorderingColumns }] =
    useReorderBoardColumnsMutation();
  const [updateBoardColumn, { isLoading: isUpdatingColumn }] = useUpdateBoardColumnMutation();
  const [deleteBoardColumn, { isLoading: isDeletingColumn }] = useDeleteBoardColumnMutation();

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuColumnId, setMenuColumnId] = useState<string | null>(null);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingColor, setEditingColor] = useState("");
  const [confirmDeleteAnchor, setConfirmDeleteAnchor] = useState<HTMLElement | null>(null);
  const [confirmDeleteColumnId, setConfirmDeleteColumnId] = useState<string | null>(null);
  const [deleteTargetColumnId, setDeleteTargetColumnId] = useState("");
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<DraggedTaskState | null>(null);
  const [activeColumnDropId, setActiveColumnDropId] = useState<string | null>(null);
  const [activeColumnDropPosition, setActiveColumnDropPosition] =
    useState<ColumnDropPosition | null>(null);
  const [activeColumnTaskDropPosition, setActiveColumnTaskDropPosition] =
    useState<ColumnTaskDropPosition | null>(null);
  const [activeTaskDropKey, setActiveTaskDropKey] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "success" | null>(null);

  const isMutating =
    isMovingTask || isUpdatingTask || isReorderingColumns || isUpdatingColumn || isDeletingColumn;
  const sortedColumns = useMemo(() => getSortedColumns(columnRecords), [columnRecords]);
  const confirmDeleteColumn =
    sortedColumns.find((column) => column._id === confirmDeleteColumnId) ?? null;

  const isDeleteDisabled = useMemo(() => {
    if (!confirmDeleteColumn) {
      return true;
    }

    const taskCount = tasksByColumn[confirmDeleteColumn._id]?.length ?? 0;

    return taskCount > 0 && deleteTargetColumnId === "";
  }, [confirmDeleteColumn, deleteTargetColumnId, tasksByColumn]);

  const handleColumnMenuOpen = (event: MouseEvent<HTMLElement>, columnId: string): void => {
    setMenuAnchor(event.currentTarget);
    setMenuColumnId(columnId);
  };

  const handleColumnMenuClose = (): void => {
    setMenuAnchor(null);
    setMenuColumnId(null);
  };

  const handleCancelColumnEdit = (): void => {
    setEditingColumnId(null);
    setEditingTitle("");
    setEditingColor("");
  };

  const handleDeleteCancel = (): void => {
    setConfirmDeleteAnchor(null);
    setConfirmDeleteColumnId(null);
    setDeleteTargetColumnId("");
  };

  const handleColumnMenuAction = (action: ColumnMenuAction): void => {
    const selectedColumn = sortedColumns.find((column) => column._id === menuColumnId);

    if (!selectedColumn) {
      handleColumnMenuClose();
      return;
    }

    if (action === "edit") {
      setEditingColumnId(selectedColumn._id);
      setEditingTitle(selectedColumn.title);
      setEditingColor(selectedColumn.color ?? "#5355ff");
    }

    if (action === "delete") {
      const fallbackTargetColumnId =
        sortedColumns.find((column) => column._id !== selectedColumn._id)?._id ?? "";

      setConfirmDeleteAnchor(menuAnchor);
      setConfirmDeleteColumnId(selectedColumn._id);
      setDeleteTargetColumnId(fallbackTargetColumnId);
    }

    handleColumnMenuClose();
  };

  const handleEditTitleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEditingTitle(event.target.value);
  };

  const handleEditColorChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEditingColor(event.target.value);
  };

  const handleColumnDeleteTargetChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setDeleteTargetColumnId(event.target.value);
  };

  const handleSaveColumnEdit = async (): Promise<void> => {
    if (!editingColumnId) {
      return;
    }

    const title = editingTitle.trim();

    if (!title) {
      setStatusMessage("Column title is required.");
      setStatusTone("error");
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await updateBoardColumn({
        boardId,
        color: normalizeOptionalValue(editingColor),
        columnId: editingColumnId,
        projectId,
        title,
      }).unwrap();

      handleCancelColumnEdit();
      setStatusMessage("Board column updated.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getApiErrorMessage(error, "Unable to update the board column."));
      setStatusTone("error");
    }
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!confirmDeleteColumn) {
      return;
    }

    const taskCount = tasksByColumn[confirmDeleteColumn._id]?.length ?? 0;

    if (taskCount > 0 && !deleteTargetColumnId) {
      setStatusMessage("Choose a target column before deleting a non-empty column.");
      setStatusTone("error");
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await deleteBoardColumn({
        boardId,
        columnId: confirmDeleteColumn._id,
        projectId,
        targetColumnId: taskCount > 0 ? deleteTargetColumnId : undefined,
      }).unwrap();

      handleDeleteCancel();
      handleCancelColumnEdit();
      setStatusMessage("Board column deleted.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getApiErrorMessage(error, "Unable to delete the board column."));
      setStatusTone("error");
    }
  };

  const handleColumnDragStart = (event: DragEvent<HTMLElement>, columnId: string): void => {
    if (!canManageBoard || isMutating) {
      event.preventDefault();
      return;
    }

    setDraggedColumnId(columnId);
    setDraggedTask(null);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", `column:${columnId}`);
  };

  const handleColumnDragOver = (event: DragEvent<HTMLElement>, targetColumnId: string): void => {
    if (!draggedColumnId || draggedTask) {
      return;
    }

    event.preventDefault();
    const targetRect = event.currentTarget.getBoundingClientRect();
    const placeAfter = event.clientX > targetRect.left + targetRect.width / 2;
    setActiveColumnDropId(targetColumnId);
    setActiveColumnDropPosition(placeAfter ? "after" : "before");
    setActiveColumnTaskDropPosition(null);
  };

  const handleColumnDrop = async (
    event: DragEvent<HTMLElement>,
    targetColumnId: string,
  ): Promise<void> => {
    if (!draggedColumnId || draggedTask || draggedColumnId === targetColumnId) {
      return;
    }

    event.preventDefault();
    setActiveColumnDropId(null);
    setActiveColumnDropPosition(null);

    const targetRect = event.currentTarget.getBoundingClientRect();
    const placeAfter = event.clientX > targetRect.left + targetRect.width / 2;
    const reorderedColumns = [...sortedColumns];
    const draggedColumnIndex = reorderedColumns.findIndex(
      (column) => column._id === draggedColumnId,
    );
    const [draggedColumn] = reorderedColumns.splice(draggedColumnIndex, 1);

    if (!draggedColumn) {
      setDraggedColumnId(null);
      return;
    }

    const targetIndex = reorderedColumns.findIndex((column) => column._id === targetColumnId);
    const insertIndex = placeAfter ? targetIndex + 1 : targetIndex;

    reorderedColumns.splice(insertIndex, 0, draggedColumn);

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await reorderBoardColumns({
        boardId,
        items: reorderedColumns.map((column, index) => ({
          columnId: column._id,
          position: index,
        })),
        projectId,
      }).unwrap();

      setStatusMessage("Board columns reordered.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getApiErrorMessage(error, "Unable to reorder board columns."));
      setStatusTone("error");
    } finally {
      setDraggedColumnId(null);
    }
  };

  const handleColumnDragEnd = (): void => {
    setDraggedColumnId(null);
    setActiveColumnDropId(null);
    setActiveColumnDropPosition(null);
  };

  const isTaskDraggable = (taskId: string, columnId: string): boolean => {
    if (isMutating || !canManageTasks) {
      return false;
    }

    const task = tasksByColumn[columnId]?.find((item) => item._id === taskId);

    if (!task) {
      return false;
    }

    return Boolean(task);
  };

  const handleTaskDragStart = (
    event: DragEvent<HTMLElement>,
    sourceColumnId: string,
    taskId: string,
  ): void => {
    if (!isTaskDraggable(taskId, sourceColumnId)) {
      event.preventDefault();
      return;
    }

    setDraggedTask({ sourceColumnId, taskId });
    setDraggedColumnId(null);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", `task:${taskId}`);
  };

  const handleTaskDragOver = (
    event: DragEvent<HTMLElement>,
    columnId: string,
    taskId?: string,
  ): void => {
    if (!draggedTask) {
      return;
    }

    event.preventDefault();

    if (!taskId) {
      const targetRect = event.currentTarget.getBoundingClientRect();
      const position: ColumnTaskDropPosition =
        event.clientY < targetRect.top + targetRect.height / 2 ? "top" : "bottom";
      setActiveColumnDropId(columnId);
      setActiveColumnTaskDropPosition(position);
      setActiveColumnDropPosition(null);
      setActiveTaskDropKey(null);
      return;
    }

    const targetRect = event.currentTarget.getBoundingClientRect();
    const position: TaskDropPosition =
      event.clientY < targetRect.top + targetRect.height / 2 ? "before" : "after";

    setActiveColumnDropId(null);
    setActiveColumnTaskDropPosition(null);
    setActiveTaskDropKey(`${columnId}:${taskId}:${position}`);
  };

  const handleTaskToggleCompleted = async (taskId: string, columnId: string): Promise<void> => {
    const task = tasksByColumn[columnId]?.find((item) => item._id === taskId);

    if (!task || !canManageTasks) {
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await updateTask({
        boardId,
        projectId,
        taskId,
        workflowState: task.workflowState === "done" ? "open" : "done",
      }).unwrap();

      setStatusMessage(
        task.workflowState === "done" ? "Task moved back to active." : "Task marked as done.",
      );
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getApiErrorMessage(error, "Unable to update the task status."));
      setStatusTone("error");
    }
  };

  const moveDraggedTask = async (
    targetColumnId: string,
    beforeTaskId?: string,
    afterTaskId?: string,
  ): Promise<void> => {
    if (!draggedTask) {
      return;
    }

    const { sourceColumnId, taskId } = draggedTask;

    if (
      sourceColumnId === targetColumnId &&
      beforeTaskId === undefined &&
      afterTaskId === undefined
    ) {
      setDraggedTask(null);
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await moveTask({
        afterTaskId,
        beforeTaskId,
        boardId,
        projectId,
        sourceColumnId,
        targetColumnId,
        taskId,
      }).unwrap();

      setStatusMessage("Task moved.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getApiErrorMessage(error, "Unable to move the task."));
      setStatusTone("error");
    } finally {
      setDraggedTask(null);
      setActiveColumnDropId(null);
      setActiveColumnDropPosition(null);
      setActiveColumnTaskDropPosition(null);
      setActiveTaskDropKey(null);
    }
  };

  const handleTaskDropOnColumn = async (
    event: DragEvent<HTMLElement>,
    targetColumnId: string,
  ): Promise<void> => {
    if (!draggedTask) {
      return;
    }

    event.preventDefault();

    const targetTasks = (tasksByColumn[targetColumnId] ?? []).filter(
      (task) => task._id !== draggedTask.taskId,
    );
    const targetRect = event.currentTarget.getBoundingClientRect();
    const placeAtTop = event.clientY < targetRect.top + targetRect.height / 2;
    const beforeTaskId = placeAtTop ? undefined : targetTasks[targetTasks.length - 1]?._id;
    const afterTaskId = placeAtTop ? targetTasks[0]?._id : undefined;

    await moveDraggedTask(targetColumnId, beforeTaskId, afterTaskId);
  };

  const handleTaskDropOnTask = async (
    event: DragEvent<HTMLElement>,
    targetColumnId: string,
    targetTaskId: string,
  ): Promise<void> => {
    if (!draggedTask) {
      return;
    }

    event.preventDefault();

    if (draggedTask.taskId === targetTaskId && draggedTask.sourceColumnId === targetColumnId) {
      setDraggedTask(null);
      setActiveColumnDropPosition(null);
      setActiveColumnTaskDropPosition(null);
      setActiveTaskDropKey(null);
      return;
    }

    const targetRect = event.currentTarget.getBoundingClientRect();
    const position: TaskDropPosition =
      event.clientY < targetRect.top + targetRect.height / 2 ? "before" : "after";
    const targetTasks = (tasksByColumn[targetColumnId] ?? []).filter(
      (task) => task._id !== draggedTask.taskId,
    );
    const targetIndex = targetTasks.findIndex((task) => task._id === targetTaskId);

    if (targetIndex < 0) {
      await moveDraggedTask(targetColumnId);
      return;
    }

    const beforeTaskId =
      position === "before" ? targetTasks[targetIndex - 1]?._id : targetTasks[targetIndex]?._id;
    const afterTaskId =
      position === "before" ? targetTasks[targetIndex]?._id : targetTasks[targetIndex + 1]?._id;

    await moveDraggedTask(targetColumnId, beforeTaskId, afterTaskId);
  };

  const handleTaskDragEnd = (): void => {
    setDraggedTask(null);
    setActiveColumnDropId(null);
    setActiveColumnDropPosition(null);
    setActiveColumnTaskDropPosition(null);
    setActiveTaskDropKey(null);
  };

  return {
    activeColumnDropId,
    activeColumnDropPosition,
    activeColumnTaskDropPosition,
    activeTaskDropKey,
    confirmDeleteAnchor,
    confirmDeleteColumn,
    deleteTargetColumnId,
    draggedColumnId,
    draggedTaskId: draggedTask?.taskId ?? null,
    editingColor,
    editingColumnId,
    editingTitle,
    handleCancelColumnEdit,
    handleColumnDeleteTargetChange,
    handleColumnDragEnd,
    handleColumnDragOver,
    handleColumnDragStart,
    handleColumnDrop,
    handleColumnMenuAction,
    handleColumnMenuClose,
    handleColumnMenuOpen,
    handleConfirmDelete,
    handleDeleteCancel,
    handleEditColorChange,
    handleEditTitleChange,
    handleSaveColumnEdit,
    handleTaskDragEnd,
    handleTaskDragOver,
    handleTaskDragStart,
    handleTaskToggleCompleted,
    handleTaskDropOnColumn,
    handleTaskDropOnTask,
    isColumnBeingEdited: (columnId: string) => editingColumnId === columnId,
    isDeleteDisabled,
    isMutating,
    isTaskDraggable,
    menuAnchor,
    menuColumnId,
    statusMessage,
    statusTone,
  };
};
