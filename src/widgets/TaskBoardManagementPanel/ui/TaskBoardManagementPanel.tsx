import { Box, Button, TextField, Typography } from "@mui/material";
import type { FC } from "react";

import { type BoardColumnRecord, type BoardRecord, type TaskRecord } from "@/shared/api/types";
import { useStatusToast } from "@/shared/lib/toast/useStatusToast";
import { AppModal } from "@/shared/ui/molecules/AppModal/AppModal";

import { useTaskBoardManagementPanel } from "../model/useTaskBoardManagementPanel";
import styles from "./TaskBoardManagementPanel.module.scss";

export type TaskBoardManagementMode = "create-board" | "create-column" | "current-board";

interface TaskBoardManagementPanelProps {
  board: BoardRecord;
  boards: BoardRecord[];
  canManageBoard: boolean;
  columns: BoardColumnRecord[];
  mode: TaskBoardManagementMode;
  onClose: () => void;
  open: boolean;
  projectId: string;
  tasksByColumn: Record<string, TaskRecord[]>;
}

export const TaskBoardManagementPanel: FC<TaskBoardManagementPanelProps> = ({
  board,
  boards,
  canManageBoard,
  columns,
  mode,
  onClose,
  open,
  projectId,
  tasksByColumn,
}) => {
  const {
    boardForm,
    canDeleteBoard,
    createBoardForm,
    handleBoardFieldChange,
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
    <AppModal
      open={open}
      onClose={onClose}
      title={
        mode === "current-board"
          ? "Board control center"
          : mode === "create-board"
            ? "Create board"
            : "Create column"
      }
    >
      <Box className={styles.panel}>
        <Box className={styles.panelHeader}>
          <Box>
            <Typography className={styles.subtitle}>
              {mode === "current-board"
                ? "Edit the selected board without leaving the task workspace."
                : mode === "create-board"
                  ? "Create another board for this project."
                  : "Add a new column to the current board."}
            </Typography>
          </Box>
        </Box>

        <section className={styles.section}>
          {mode === "current-board" && (
            <>
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
                  disabled={
                    !canManageBoard || isMutating || !boardForm.title.trim() || !isBoardDirty
                  }
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
            </>
          )}

          {mode === "create-board" && (
            <>
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
            </>
          )}

          {mode === "create-column" && (
            <>
              <Typography component="h3" className={styles.sectionTitle}>
                Create column
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
            </>
          )}
        </section>
      </Box>
    </AppModal>
  );
};
