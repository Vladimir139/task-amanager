import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";

import { useGetRecentFilesQuery, useUploadFileMutation } from "@/entities/file";
import {
  taskCategoryOptions,
  taskPriorityOptions,
  taskWorkflowStateOptions,
  useGetTaskByIdQuery,
} from "@/entities/task";
import { selectAuthUser } from "@/entities/user";
import { useAttachTaskFilesMutation } from "@/features/attachTaskFiles";
import { useCreateTaskMutation } from "@/features/createTask";
import { useDeleteTaskMutation } from "@/features/deleteTask";
import { useMoveTaskMutation } from "@/features/moveTask";
import {
  useUpdateTaskAssigneesMutation,
  useUpdateTaskWatchersMutation,
} from "@/features/taskParticipants";
import { useUpdateTaskMutation } from "@/features/updateTask";
import type { BoardColumnRecord, TaskRecord } from "@/shared/api/types";
import { useAppSelector } from "@/shared/libs/redux";

type TaskMovePlacement = "top" | "bottom";

interface TaskFormState {
  assigneeIds: string[];
  category: string;
  columnId: string;
  description: string;
  dueDate: string;
  emoji: string;
  priority: string;
  startDate: string;
  title: string;
  workflowState: string;
}

interface MemberOption {
  id: string;
  initials: string;
  isOnline?: boolean;
  name: string;
}

interface UseTaskBoardTaskDialogProps {
  boardId: string;
  canManageBoard: boolean;
  columns: BoardColumnRecord[];
  createColumnId: string | null;
  memberOptions: MemberOption[];
  onClose: () => void;
  onTaskCreated: (taskId: string) => void;
  openTaskId: string | null;
  projectId: string;
  tasksByColumn: Record<string, TaskRecord[]>;
}

interface UseTaskBoardTaskDialogResult {
  attachmentCount: number;
  availableFiles: Array<{ id: string; label: string }>;
  canManageTask: boolean;
  dialogTitle: string;
  form: TaskFormState;
  handleAttachExistingFiles: () => Promise<void>;
  handleDeleteTask: () => Promise<void>;
  handleFieldChange: (
    field: keyof TaskFormState,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleMovePlacementChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleMoveTask: () => Promise<void>;
  handleSaveAssignees: () => Promise<void>;
  handleSaveTask: () => Promise<void>;
  handleSaveWatchers: () => Promise<void>;
  handleSelectedExistingFileToggle: (fileId: string) => void;
  handleUploadNewFiles: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleWatcherToggle: (userId: string) => void;
  isCreateMode: boolean;
  isLoading: boolean;
  isMutating: boolean;
  isOpen: boolean;
  memberOptions: MemberOption[];
  movePlacement: TaskMovePlacement;
  moveTargetColumnId: string;
  onClose: () => void;
  priorityOptions: typeof taskPriorityOptions;
  recentFilesError: boolean;
  selectedExistingFileIds: string[];
  setAssigneeSelection: (userId: string) => void;
  setMoveTargetColumnId: (value: string) => void;
  statusMessage: string | null;
  statusTone: "error" | "success" | null;
  taskCategoryOptions: typeof taskCategoryOptions;
  taskLoadError: boolean;
  taskWorkflowStateOptions: typeof taskWorkflowStateOptions;
  watcherIds: string[];
}

const initialFormState: TaskFormState = {
  assigneeIds: [],
  category: "other",
  columnId: "",
  description: "",
  dueDate: "",
  emoji: "",
  priority: "medium",
  startDate: "",
  title: "",
  workflowState: "open",
};

const formatDateInput = (value?: string | null): string => value?.split("T")[0] ?? "";

const toIsoDate = (value: string): string | undefined =>
  value ? new Date(`${value}T00:00:00.000Z`).toISOString() : undefined;

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

export const useTaskBoardTaskDialog = ({
  boardId,
  canManageBoard,
  columns,
  createColumnId,
  memberOptions,
  onClose,
  onTaskCreated,
  openTaskId,
  projectId,
  tasksByColumn,
}: UseTaskBoardTaskDialogProps): UseTaskBoardTaskDialogResult => {
  const authUser = useAppSelector(selectAuthUser);
  const isCreateMode = Boolean(createColumnId) && !openTaskId;
  const isOpen = Boolean(openTaskId) || Boolean(createColumnId);
  const [form, setForm] = useState<TaskFormState>(initialFormState);
  const [moveTargetColumnId, setMoveTargetColumnId] = useState("");
  const [movePlacement, setMovePlacement] = useState<TaskMovePlacement>("bottom");
  const [watcherIds, setWatcherIds] = useState<string[]>([]);
  const [selectedExistingFileIds, setSelectedExistingFileIds] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "success" | null>(null);

  const {
    data: task,
    isError: isTaskError,
    isLoading: isTaskLoading,
  } = useGetTaskByIdQuery(openTaskId ?? "", {
    skip: !openTaskId,
  });
  const { data: recentFiles = [], isError: recentFilesError } = useGetRecentFilesQuery(undefined, {
    skip: !isOpen || isCreateMode,
  });
  const [createTask, { isLoading: isCreatingTask }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdatingTask }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeletingTask }] = useDeleteTaskMutation();
  const [moveTask, { isLoading: isMovingTask }] = useMoveTaskMutation();
  const [updateTaskAssignees, { isLoading: isSavingAssignees }] = useUpdateTaskAssigneesMutation();
  const [updateTaskWatchers, { isLoading: isSavingWatchers }] = useUpdateTaskWatchersMutation();
  const [attachTaskFiles, { isLoading: isAttachingFiles }] = useAttachTaskFilesMutation();
  const [uploadFile, { isLoading: isUploadingFiles }] = useUploadFileMutation();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (isCreateMode) {
      setForm({
        ...initialFormState,
        columnId: createColumnId ?? columns[0]?._id ?? "",
      });
      setMoveTargetColumnId(createColumnId ?? columns[0]?._id ?? "");
      setMovePlacement("bottom");
      setWatcherIds([]);
      setSelectedExistingFileIds([]);
      setStatusMessage(null);
      setStatusTone(null);
      return;
    }

    if (!task) {
      return;
    }

    setForm({
      assigneeIds: task.assigneeIds,
      category: task.category,
      columnId: task.columnId,
      description: task.description ?? "",
      dueDate: formatDateInput(task.dueDate),
      emoji: task.emoji ?? "",
      priority: task.priority,
      startDate: formatDateInput(task.startDate),
      title: task.title,
      workflowState: task.workflowState,
    });
    setMoveTargetColumnId(task.columnId);
    setMovePlacement("bottom");
    setWatcherIds(task.watcherIds);
    setSelectedExistingFileIds([]);
    setStatusMessage(null);
    setStatusTone(null);
  }, [columns, createColumnId, isCreateMode, isOpen, task]);

  const canManageTask = useMemo(() => {
    if (isCreateMode) {
      return true;
    }

    if (!task) {
      return false;
    }

    return canManageBoard || task.reporterId === authUser?.id;
  }, [authUser?.id, canManageBoard, isCreateMode, task]);

  const availableFiles = useMemo(() => {
    return recentFiles
      .filter((file) => !projectId || !file.projectId || file.projectId === projectId)
      .map((file) => ({
        id: file._id,
        label: file.originalName,
      }));
  }, [projectId, recentFiles]);

  const attachmentCount = task?.attachmentCount ?? 0;
  const dialogTitle = isCreateMode ? "Create task" : (task?.title ?? "Task details");

  const isMutating =
    isCreatingTask ||
    isUpdatingTask ||
    isDeletingTask ||
    isMovingTask ||
    isSavingAssignees ||
    isSavingWatchers ||
    isAttachingFiles ||
    isUploadingFiles;

  const handleFieldChange =
    (field: keyof TaskFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setForm((currentState) => ({
        ...currentState,
        [field]: event.target.value,
      }));
    };

  const setAssigneeSelection = (userId: string): void => {
    setForm((currentState) => ({
      ...currentState,
      assigneeIds: currentState.assigneeIds.includes(userId)
        ? currentState.assigneeIds.filter((item) => item !== userId)
        : [...currentState.assigneeIds, userId],
    }));
  };

  const handleWatcherToggle = (userId: string): void => {
    setWatcherIds((currentState) =>
      currentState.includes(userId)
        ? currentState.filter((item) => item !== userId)
        : [...currentState, userId],
    );
  };

  const handleMovePlacementChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setMovePlacement(event.target.value as TaskMovePlacement);
  };

  const handleSelectedExistingFileToggle = (fileId: string): void => {
    setSelectedExistingFileIds((currentState) =>
      currentState.includes(fileId)
        ? currentState.filter((item) => item !== fileId)
        : [...currentState, fileId],
    );
  };

  const handleSaveTask = async (): Promise<void> => {
    const normalizedTitle = form.title.trim();

    if (!normalizedTitle) {
      setStatusMessage("Task title is required.");
      setStatusTone("error");
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      if (isCreateMode) {
        const createdTask = await createTask({
          assigneeIds: form.assigneeIds,
          boardId,
          category: form.category,
          columnId: form.columnId,
          description: normalizeOptionalValue(form.description),
          emoji: normalizeOptionalValue(form.emoji),
          priority: form.priority,
          projectId,
          startDate: toIsoDate(form.startDate),
          dueDate: toIsoDate(form.dueDate),
          title: normalizedTitle,
        }).unwrap();

        onTaskCreated(createdTask._id);
        return;
      }

      if (!task) {
        return;
      }

      await updateTask({
        boardId,
        category: form.category,
        columnId: form.columnId,
        description: normalizeOptionalValue(form.description),
        dueDate: toIsoDate(form.dueDate),
        emoji: normalizeOptionalValue(form.emoji),
        priority: form.priority,
        projectId,
        startDate: toIsoDate(form.startDate),
        taskId: task._id,
        title: normalizedTitle,
        workflowState: form.workflowState,
      }).unwrap();

      setStatusMessage("Task details updated.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(
        getErrorMessage(
          error,
          isCreateMode ? "Unable to create the task." : "Unable to update the task.",
        ),
      );
      setStatusTone("error");
    }
  };

  const handleDeleteTask = async (): Promise<void> => {
    if (!task) {
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await deleteTask({
        boardId,
        projectId,
        taskId: task._id,
      }).unwrap();

      onClose();
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Unable to delete the task."));
      setStatusTone("error");
    }
  };

  const handleMoveTask = async (): Promise<void> => {
    if (!task) {
      return;
    }

    const targetTasks = (tasksByColumn[moveTargetColumnId] ?? []).filter(
      (item) => item._id !== task._id,
    );
    const firstTaskId = targetTasks[0]?._id;
    const lastTaskId = targetTasks[targetTasks.length - 1]?._id;

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await moveTask({
        afterTaskId: movePlacement === "top" ? firstTaskId : undefined,
        beforeTaskId: movePlacement === "bottom" ? lastTaskId : undefined,
        boardId,
        projectId,
        sourceColumnId: task.columnId,
        targetColumnId: moveTargetColumnId,
        taskId: task._id,
      }).unwrap();

      setStatusMessage("Task moved successfully.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Unable to move the task."));
      setStatusTone("error");
    }
  };

  const handleSaveAssignees = async (): Promise<void> => {
    if (!task) {
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await updateTaskAssignees({
        boardId,
        projectId,
        taskId: task._id,
        userIds: form.assigneeIds,
      }).unwrap();

      setStatusMessage("Task assignees updated.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Unable to update task assignees."));
      setStatusTone("error");
    }
  };

  const handleSaveWatchers = async (): Promise<void> => {
    if (!task) {
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await updateTaskWatchers({
        boardId,
        projectId,
        taskId: task._id,
        userIds: watcherIds,
      }).unwrap();

      setStatusMessage("Task watchers updated.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Unable to update task watchers."));
      setStatusTone("error");
    }
  };

  const handleAttachExistingFiles = async (): Promise<void> => {
    if (!task || selectedExistingFileIds.length === 0) {
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      await attachTaskFiles({
        boardId,
        fileIds: selectedExistingFileIds,
        projectId,
        taskId: task._id,
      }).unwrap();

      setSelectedExistingFileIds([]);
      setStatusMessage("Files attached to the task.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Unable to attach files to the task."));
      setStatusTone("error");
    }
  };

  const handleUploadNewFiles = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!task) {
      return;
    }

    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    setStatusMessage(null);
    setStatusTone(null);

    try {
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const uploadedFile = await uploadFile({
            file,
            projectId,
          }).unwrap();

          return uploadedFile;
        }),
      );

      await attachTaskFiles({
        boardId,
        fileIds: uploadedFiles.map((file) => file._id),
        projectId,
        taskId: task._id,
      }).unwrap();

      event.target.value = "";
      setStatusMessage("New files uploaded and attached.");
      setStatusTone("success");
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Unable to upload files for the task."));
      setStatusTone("error");
    }
  };

  return {
    attachmentCount,
    availableFiles,
    canManageTask,
    dialogTitle,
    form,
    handleAttachExistingFiles,
    handleDeleteTask,
    handleFieldChange,
    handleMovePlacementChange,
    handleMoveTask,
    handleSaveAssignees,
    handleSaveTask,
    handleSaveWatchers,
    handleSelectedExistingFileToggle,
    handleUploadNewFiles,
    handleWatcherToggle,
    isCreateMode,
    isLoading: isTaskLoading,
    isMutating,
    isOpen,
    memberOptions,
    movePlacement,
    moveTargetColumnId,
    onClose,
    priorityOptions: taskPriorityOptions,
    recentFilesError: recentFilesError || isTaskError,
    selectedExistingFileIds,
    setAssigneeSelection,
    setMoveTargetColumnId,
    statusMessage,
    statusTone,
    taskCategoryOptions,
    taskLoadError: isTaskError,
    taskWorkflowStateOptions,
    watcherIds,
  };
};
