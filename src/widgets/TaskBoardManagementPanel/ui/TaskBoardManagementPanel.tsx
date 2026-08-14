import { Alert, Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import type { FC } from "react";

import { type BoardColumnRecord, type BoardRecord, type TaskRecord } from "@/shared/api/types";
import { useStatusToast } from "@/shared/lib/toast/useStatusToast";

import { useTaskBoardManagementPanel } from "../model/useTaskBoardManagementPanel";
import styles from "./TaskBoardManagementPanel.module.scss";

interface TaskBoardManagementPanelProps {
  board: BoardRecord;
  boards: BoardRecord[];
  canManageBoard: boolean;
  columns: BoardColumnRecord[];
  projectId: string;
  tasksByColumn: Record<string, TaskRecord[]>;
}

export const TaskBoardManagementPanel: FC<TaskBoardManagementPanelProps> = ({
  board,
  boards,
  canManageBoard,
  columns,
  projectId,
  tasksByColumn,
}) => {
  const {
    boardForm,
    canDeleteBoard,
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
    isBoardDirty,
    isMutating,
    newColumnColor,
    newColumnTitle,
    statusMessage,
    statusTone,
  } = useTaskBoardManagementPanel({
    board,
    boards,
    canManageBoard,
    columns,
    projectId,
    tasksByColumn,
  });

  useStatusToast({ message: statusMessage, tone: statusTone });

  return (
    <Paper className={styles.panel} elevation={0}>
      <Box className={styles.panelHeader}>
        <Box>
          <Typography component="h2" className={styles.title}>
            Board control center
          </Typography>

          <Typography className={styles.subtitle}>
            Manage the current board, create additional boards, and keep column structure aligned
            with the backend contract.
          </Typography>
        </Box>
      </Box>

      {!canManageBoard && (
        <Alert severity="info" className={styles.statusAlert}>
          You have read access to this board. Only owners and admins can update board metadata or
          manage columns.
        </Alert>
      )}

      <Box className={styles.contentGrid}>
        <section className={styles.section}>
          <Typography component="h3" className={styles.sectionTitle}>
            Current board
          </Typography>

          <Box className={styles.formGrid}>
            <TextField
              label="Board title"
              value={boardForm.title}
              onChange={handleBoardFieldChange("title")}
              disabled={!canManageBoard}
              fullWidth
            />

            <TextField
              label="Emoji"
              value={boardForm.emoji}
              onChange={handleBoardFieldChange("emoji")}
              disabled={!canManageBoard}
              fullWidth
            />

            <TextField
              label="Description"
              value={boardForm.description}
              onChange={handleBoardFieldChange("description")}
              disabled={!canManageBoard}
              multiline
              minRows={4}
              fullWidth
              className={styles.fullWidthField}
            />
          </Box>

          <Box className={styles.actionRow}>
            <Button
              variant="contained"
              onClick={() => {
                void handleSaveBoard();
              }}
              disabled={!canManageBoard || isMutating || !boardForm.title.trim() || !isBoardDirty}
            >
              Save board
            </Button>

            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                void handleDeleteBoard();
              }}
              disabled={!canManageBoard || !canDeleteBoard || isMutating}
            >
              Delete board
            </Button>
          </Box>
        </section>

        <section className={styles.section}>
          <Typography component="h3" className={styles.sectionTitle}>
            Create board
          </Typography>

          <Box className={styles.formGrid}>
            <TextField
              label="Board title"
              value={createBoardForm.title}
              onChange={handleCreateBoardFieldChange("title")}
              disabled={!canManageBoard}
              fullWidth
            />

            <TextField
              label="Emoji"
              value={createBoardForm.emoji}
              onChange={handleCreateBoardFieldChange("emoji")}
              disabled={!canManageBoard}
              fullWidth
            />

            <TextField
              label="Description"
              value={createBoardForm.description}
              onChange={handleCreateBoardFieldChange("description")}
              disabled={!canManageBoard}
              multiline
              minRows={4}
              fullWidth
              className={styles.fullWidthField}
            />
          </Box>

          <Box className={styles.actionRow}>
            <Button
              variant="contained"
              onClick={() => {
                void handleCreateBoard();
              }}
              disabled={!canManageBoard || isMutating || !createBoardForm.title.trim()}
            >
              Create board
            </Button>
          </Box>
        </section>
      </Box>

      <section className={styles.section}>
        <Typography component="h3" className={styles.sectionTitle}>
          Board columns
        </Typography>

        <Box className={styles.newColumnRow}>
          <TextField
            label="New column title"
            value={newColumnTitle}
            onChange={handleNewColumnTitleChange}
            disabled={!canManageBoard}
            fullWidth
          />

          <TextField
            label="Color"
            value={newColumnColor}
            onChange={handleNewColumnColorChange}
            disabled={!canManageBoard}
            placeholder="#5355ff"
            fullWidth
          />

          <Button
            variant="contained"
            onClick={() => {
              void handleCreateColumn();
            }}
            disabled={!canManageBoard || isMutating || !newColumnTitle.trim()}
          >
            Add column
          </Button>
        </Box>

        <Box className={styles.columnList}>
          {columnItems.map((column) => (
            <Paper key={column.id} className={styles.columnCard} elevation={0}>
              <Box className={styles.columnCardHeader}>
                <Box>
                  <Typography className={styles.columnTitle}>{column.title}</Typography>
                  <Typography className={styles.columnMeta}>
                    {column.kind === "system" ? "System column" : "Custom column"} ·{" "}
                    {column.taskCount} tasks
                    {column.isLocked ? " · Locked" : ""}
                  </Typography>
                </Box>
              </Box>

              <Box className={styles.columnFields}>
                <TextField
                  label="Title"
                  value={column.title}
                  onChange={handleColumnFieldChange(column.id, "title")}
                  disabled={!canManageBoard}
                  fullWidth
                />

                <TextField
                  label="Color"
                  value={column.color}
                  onChange={handleColumnFieldChange(column.id, "color")}
                  disabled={!canManageBoard}
                  placeholder="#5355ff"
                  fullWidth
                />

                <TextField
                  select
                  label="Move tasks to"
                  value={column.deleteTargetColumnId}
                  onChange={handleColumnFieldChange(column.id, "deleteTargetColumnId")}
                  disabled={!canManageBoard || column.kind !== "custom" || column.taskCount === 0}
                  fullWidth
                >
                  {column.deleteTargetOptions.length > 0 ? (
                    column.deleteTargetOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.title}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No target columns available
                    </MenuItem>
                  )}
                </TextField>
              </Box>

              <Box className={styles.columnActions}>
                <Button
                  variant="contained"
                  onClick={() => {
                    void handleColumnSave(column.id);
                  }}
                  disabled={
                    !canManageBoard || isMutating || !column.title.trim() || !column.hasChanges
                  }
                >
                  Save
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => {
                    void handleColumnMove(column.id, "left");
                  }}
                  disabled={!canManageBoard || isMutating || columns[0]?._id === column.id}
                >
                  Move left
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => {
                    void handleColumnMove(column.id, "right");
                  }}
                  disabled={
                    !canManageBoard || isMutating || columns[columns.length - 1]?._id === column.id
                  }
                >
                  Move right
                </Button>

                <Button
                  color="error"
                  variant="text"
                  onClick={() => {
                    void handleColumnDelete(column.id);
                  }}
                  disabled={!canManageBoard || isMutating || column.kind !== "custom"}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      </section>
    </Paper>
  );
};
