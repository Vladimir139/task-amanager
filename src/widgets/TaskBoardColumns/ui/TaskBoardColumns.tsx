import { Add, CheckOutlined, CloseOutlined, MoreHoriz, MoreVert } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import type { ChangeEvent, DragEvent, FC, MouseEvent } from "react";

import type { BoardColumn } from "@/entities/boardTask";
import { BoardTaskCard } from "@/entities/boardTask";
import type { BoardColumnRecord, TaskRecord } from "@/shared/api/types";
import { useStatusToast } from "@/shared/lib/toast/useStatusToast";

import { useTaskBoardColumns } from "../model/useTaskBoardColumns";
import styles from "./TaskBoardColumns.module.scss";

interface TaskBoardColumnsProps {
  boardId: string;
  canManageBoard: boolean;
  columnRecords: BoardColumnRecord[];
  columns: BoardColumn[];
  projectId: string;
  tasksByColumn: Record<string, TaskRecord[]>;
  onCreateTask: (columnId: string) => void;
  onOpenTask: (taskId: string) => void;
}

interface BoardColumnSectionProps extends BoardColumn {
  activeColumnDropId: string | null;
  canManageBoard: boolean;
  columnRecord: BoardColumnRecord;
  dragStateClassName: string | undefined;
  editingColor: string;
  editingTitle: string;
  isColumnBeingEdited: boolean;
  isMutating: boolean;
  isTaskDropActive: (taskId: string, position: "before" | "after") => boolean;
  isTaskDraggable: (taskId: string, columnId: string) => boolean;
  onCancelColumnEdit: () => void;
  onColumnDragEnd: () => void;
  onColumnDragOver: (event: DragEvent<HTMLElement>, targetColumnId: string) => void;
  onColumnDragStart: (event: DragEvent<HTMLElement>, columnId: string) => void;
  onColumnDrop: (event: DragEvent<HTMLElement>, targetColumnId: string) => void;
  onColumnMenuOpen: (event: MouseEvent<HTMLElement>, columnId: string) => void;
  onEditColorChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onEditTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSaveColumnEdit: () => void;
  onTaskDragEnd: () => void;
  onTaskDragOver: (event: DragEvent<HTMLElement>, columnId: string, taskId?: string) => void;
  onTaskDragStart: (event: DragEvent<HTMLElement>, sourceColumnId: string, taskId: string) => void;
  onTaskDropOnColumn: (event: DragEvent<HTMLElement>, targetColumnId: string) => void;
  onTaskDropOnTask: (
    event: DragEvent<HTMLElement>,
    targetColumnId: string,
    targetTaskId: string,
  ) => void;
  onCreateTask: (columnId: string) => void;
  onOpenTask: (taskId: string) => void;
}

function BoardColumnSection({
  activeColumnDropId,
  canManageBoard,
  columnRecord,
  dragStateClassName,
  editingColor,
  editingTitle,
  id,
  isColumnBeingEdited,
  isMutating,
  isTaskDraggable,
  isTaskDropActive,
  onCancelColumnEdit,
  onColumnDragEnd,
  onColumnDragOver,
  onColumnDragStart,
  onColumnDrop,
  onColumnMenuOpen,
  onEditColorChange,
  onEditTitleChange,
  onSaveColumnEdit,
  onTaskDragEnd,
  onTaskDragOver,
  onTaskDragStart,
  onTaskDropOnColumn,
  onTaskDropOnTask,
  title,
  tasks,
  onCreateTask,
  onOpenTask,
}: BoardColumnSectionProps) {
  return (
    <section
      className={`${styles.boardColumn} ${dragStateClassName ?? ""}`}
      onDragOver={(event) => {
        onColumnDragOver(event, id);
        onTaskDragOver(event, id);
      }}
      onDrop={(event) => {
        onColumnDrop(event, id);
        onTaskDropOnColumn(event, id);
      }}
    >
      <Paper
        className={styles.columnHeader}
        elevation={0}
        sx={{
          borderTop: `3px solid ${columnRecord.color ?? "#dbe2f1"}`,
        }}
      >
        <Box className={styles.columnMeta}>
          {isColumnBeingEdited ? (
            <Box className={styles.columnEditRow}>
              <TextField
                size="small"
                value={editingTitle}
                onChange={onEditTitleChange}
                className={styles.columnTitleInput}
                placeholder="Column title"
              />

              <TextField
                size="small"
                type="color"
                value={editingColor}
                onChange={onEditColorChange}
                className={styles.columnColorInput}
              />

              <IconButton
                aria-label="Save column changes"
                size="small"
                disabled={isMutating}
                onClick={() => {
                  onSaveColumnEdit();
                }}
              >
                <CheckOutlined fontSize="small" />
              </IconButton>

              <IconButton aria-label="Cancel column edit" size="small" onClick={onCancelColumnEdit}>
                <CloseOutlined fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <>
              <Typography component="h2">{title}</Typography>
              <Typography>{tasks.length} tasks</Typography>
            </>
          )}
        </Box>

        {!isColumnBeingEdited && (
          <Box className={styles.columnActions}>
            <IconButton
              aria-label={`Open actions for ${title}`}
              className={styles.columnMenuButton}
              onClick={(event) => {
                onColumnMenuOpen(event, id);
              }}
              disabled={!canManageBoard || isMutating}
            >
              <MoreHoriz />
            </IconButton>

            <IconButton
              aria-label={`Create task in ${title}`}
              className={styles.addTaskButton}
              onClick={() => {
                onCreateTask(id);
              }}
            >
              <Add />
            </IconButton>

            <IconButton
              aria-label={`Reorder ${title}`}
              className={styles.dragHandleButton}
              draggable={canManageBoard && !isMutating}
              disabled={!canManageBoard || isMutating}
              onDragEnd={onColumnDragEnd}
              onDragStart={(event) => {
                onColumnDragStart(event, id);
              }}
            >
              <MoreVert />
            </IconButton>
          </Box>
        )}
      </Paper>

      <Box className={styles.columnTasks}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Box
              key={task.id}
              className={`${styles.taskDropZone} ${
                isTaskDropActive(String(task.id), "before") ? styles.taskDropBefore : ""
              } ${isTaskDropActive(String(task.id), "after") ? styles.taskDropAfter : ""}`}
              draggable={isTaskDraggable(String(task.id), id)}
              onDragEnd={onTaskDragEnd}
              onDragOver={(event) => {
                event.stopPropagation();
                onTaskDragOver(event, id, String(task.id));
              }}
              onDragStart={(event) => {
                onTaskDragStart(event, id, String(task.id));
              }}
              onDrop={(event) => {
                event.stopPropagation();
                onTaskDropOnTask(event, id, String(task.id));
              }}
            >
              <BoardTaskCard
                task={task}
                onClick={() => {
                  onOpenTask(String(task.id));
                }}
              />
            </Box>
          ))
        ) : (
          <Typography className={styles.emptyState}>No tasks in this column yet.</Typography>
        )}

        <Box
          className={`${styles.columnDropZone} ${
            activeColumnDropId === id ? styles.columnTaskDropActive : ""
          }`}
          onDragOver={(event) => {
            onTaskDragOver(event, id);
          }}
          onDrop={(event) => {
            onTaskDropOnColumn(event, id);
          }}
        />
      </Box>
    </section>
  );
}

export const TaskBoardColumns: FC<TaskBoardColumnsProps> = ({
  boardId,
  canManageBoard,
  columnRecords,
  columns,
  projectId,
  tasksByColumn,
  onCreateTask,
  onOpenTask,
}) => {
  const {
    activeColumnDropId,
    activeTaskDropKey,
    confirmDeleteAnchor,
    confirmDeleteColumn,
    deleteTargetColumnId,
    editingColor,
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
    handleTaskDropOnColumn,
    handleTaskDropOnTask,
    isColumnBeingEdited,
    isDeleteDisabled,
    isMutating,
    isTaskDraggable,
    menuAnchor,
    statusMessage,
    statusTone,
  } = useTaskBoardColumns({
    boardId,
    canManageBoard,
    columnRecords,
    projectId,
    tasksByColumn,
  });

  useStatusToast({ message: statusMessage, tone: statusTone });

  return (
    <>
      <Box className={styles.boardScroller}>
        <Box className={styles.board}>
          {columns.map((column) => {
            const columnRecord = columnRecords.find((item) => item._id === column.id);

            if (!columnRecord) {
              return null;
            }

            return (
              <BoardColumnSection
                key={column.id}
                {...column}
                activeColumnDropId={activeColumnDropId}
                canManageBoard={canManageBoard}
                columnRecord={columnRecord}
                dragStateClassName={
                  activeColumnDropId === column.id ? styles.columnDropTarget : undefined
                }
                editingColor={editingColor}
                editingTitle={editingTitle}
                isColumnBeingEdited={isColumnBeingEdited(column.id)}
                isMutating={isMutating}
                isTaskDraggable={isTaskDraggable}
                isTaskDropActive={(taskId, position) =>
                  activeTaskDropKey === `${column.id}:${taskId}:${position}`
                }
                onCancelColumnEdit={handleCancelColumnEdit}
                onColumnDragEnd={handleColumnDragEnd}
                onColumnDragOver={handleColumnDragOver}
                onColumnDragStart={handleColumnDragStart}
                onColumnDrop={(event, targetColumnId) => {
                  void handleColumnDrop(event, targetColumnId);
                }}
                onColumnMenuOpen={handleColumnMenuOpen}
                onEditColorChange={handleEditColorChange}
                onEditTitleChange={handleEditTitleChange}
                onSaveColumnEdit={() => {
                  void handleSaveColumnEdit();
                }}
                onTaskDragEnd={handleTaskDragEnd}
                onTaskDragOver={handleTaskDragOver}
                onTaskDragStart={handleTaskDragStart}
                onTaskDropOnColumn={(event, targetColumnId) => {
                  void handleTaskDropOnColumn(event, targetColumnId);
                }}
                onTaskDropOnTask={(event, targetColumnId, targetTaskId) => {
                  void handleTaskDropOnTask(event, targetColumnId, targetTaskId);
                }}
                onCreateTask={onCreateTask}
                onOpenTask={onOpenTask}
              />
            );
          })}
        </Box>
      </Box>

      <Menu
        open={Boolean(menuAnchor)}
        anchorEl={menuAnchor}
        onClose={handleColumnMenuClose}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
      >
        <MenuItem
          onClick={() => {
            handleColumnMenuAction("edit");
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleColumnMenuAction("delete");
          }}
          disabled={columnRecords.length <= 1}
        >
          Delete
        </MenuItem>
      </Menu>

      <Popover
        open={Boolean(confirmDeleteAnchor) && Boolean(confirmDeleteColumn)}
        anchorEl={confirmDeleteAnchor}
        onClose={handleDeleteCancel}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
      >
        <Box className={styles.deletePopover}>
          <Typography className={styles.deleteTitle}>
            Delete {confirmDeleteColumn?.title ?? "column"}?
          </Typography>
          <Typography className={styles.deleteText}>
            This action cannot be undone. If the column has tasks, choose where to move them first.
          </Typography>

          {(tasksByColumn[confirmDeleteColumn?._id ?? ""]?.length ?? 0) > 0 && (
            <TextField
              select
              label="Move tasks to"
              size="small"
              value={deleteTargetColumnId}
              onChange={handleColumnDeleteTargetChange}
              fullWidth
            >
              {columnRecords
                .filter((column) => column._id !== confirmDeleteColumn?._id)
                .map((column) => (
                  <MenuItem key={column._id} value={column._id}>
                    {column.title}
                  </MenuItem>
                ))}
            </TextField>
          )}

          <Box className={styles.deleteActions}>
            <Button variant="text" onClick={handleDeleteCancel}>
              Cancel
            </Button>

            <Button
              color="error"
              variant="contained"
              disabled={isDeleteDisabled || isMutating}
              onClick={() => {
                void handleConfirmDelete();
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};
