import { ArrowForward } from "@mui/icons-material";
import { Alert, Avatar, Box, Chip, IconButton, TextField, Typography } from "@mui/material";
import type { FC } from "react";

import { taskEmojis, useQuickCreateTask } from "@/features/createTask";

import styles from "./NewTask.module.scss";

export const NewTask: FC = () => {
  const {
    canCreateTask,
    collaborators,
    currentProjectTitle,
    handleCreateTask,
    handleCollaboratorToggle,
    handleEmojiSelect,
    handleTaskTitleChange,
    helperMessage,
    isLoading,
    isProjectReady,
    selectedEmoji,
    selectedCollaboratorIds,
    statusMessage,
    statusTone,
    taskTitle,
  } = useQuickCreateTask();

  return (
    <section className={styles.newTaskSection}>
      <Box className={styles.newTaskHeader}>
        <Typography component="h2">New Task</Typography>
      </Box>

      <Typography className={styles.inputLabel}>
        Task Title {currentProjectTitle ? `- ${currentProjectTitle}` : "- No project yet"}
      </Typography>

      {statusMessage && statusTone && <Alert severity={statusTone}>{statusMessage}</Alert>}

      <TextField
        fullWidth
        value={taskTitle}
        onChange={handleTaskTitleChange}
        className={styles.taskInput}
        placeholder="Enter task title"
        disabled={!isProjectReady || isLoading}
        slotProps={{
          htmlInput: {
            "aria-label": "Task title",
          },
        }}
      />

      <Box className={styles.emojiPicker}>
        <Box className={styles.emojis}>
          {taskEmojis.map((emoji) => {
            const isSelected = selectedEmoji === emoji;

            return (
              <button
                key={emoji}
                type="button"
                aria-label={`Select ${emoji}`}
                aria-pressed={isSelected}
                className={isSelected ? styles.selectedEmoji : undefined}
                onClick={() => {
                  handleEmojiSelect(emoji);
                }}
              >
                {emoji}
              </button>
            );
          })}
        </Box>
      </Box>

      <Box className={styles.newTaskDivider} />

      <Typography className={styles.inputLabel}>Collaborators</Typography>
      <Typography className={styles.helperText}>{helperMessage}</Typography>

      <Box className={styles.collaborators}>
        <Box className={styles.collaboratorChips}>
          {collaborators.length === 0 ? (
            <Typography className={styles.helperText}>No collaborators available.</Typography>
          ) : (
            collaborators.map((collaborator) => {
              const isSelected = selectedCollaboratorIds.includes(collaborator.id);

              return (
                <Chip
                  key={collaborator.id}
                  avatar={<Avatar>{collaborator.initials}</Avatar>}
                  label={collaborator.name}
                  variant={isSelected ? "filled" : "outlined"}
                  className={isSelected ? styles.selectedCollaboratorChip : undefined}
                  onClick={() => {
                    handleCollaboratorToggle(collaborator.id);
                  }}
                />
              );
            })
          )}
        </Box>

        <IconButton
          className={styles.submitTaskButton}
          aria-label="Create task"
          onClick={() => {
            void handleCreateTask();
          }}
          disabled={!canCreateTask || isLoading}
        >
          <ArrowForward />
        </IconButton>
      </Box>
    </section>
  );
};
