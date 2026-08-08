import { Add, ArrowBackIosNew, ArrowForward, ArrowForwardIos, MoreVert } from "@mui/icons-material";
import { Avatar, Box, Chip, IconButton, TextField, Typography } from "@mui/material";
import type { FC } from "react";

import { taskEmojis, useQuickCreateTask } from "@/features/createTask";

import styles from "./NewTask.module.scss";

export const NewTask: FC = () => {
  const {
    collaborators,
    currentProjectTitle,
    handleCreateTask,
    handleEmojiSelect,
    handleTaskTitleChange,
    isLoading,
    selectedEmoji,
    taskTitle,
  } = useQuickCreateTask();

  return (
    <section className={styles.newTaskSection}>
      <Box className={styles.newTaskHeader}>
        <Typography component="h2">New Task</Typography>

        <IconButton aria-label="Task menu">
          <MoreVert />
        </IconButton>
      </Box>

      <Typography className={styles.inputLabel}>
        Task Title {currentProjectTitle ? `- ${currentProjectTitle}` : "- No project yet"}
      </Typography>

      <TextField
        fullWidth
        value={taskTitle}
        onChange={handleTaskTitleChange}
        className={styles.taskInput}
        slotProps={{
          htmlInput: {
            "aria-label": "Task title",
          },
        }}
      />

      <Box className={styles.emojiPicker}>
        <IconButton aria-label="Previous emojis">
          <ArrowBackIosNew />
        </IconButton>

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

        <IconButton aria-label="Next emojis">
          <ArrowForwardIos />
        </IconButton>
      </Box>

      <Box className={styles.newTaskDivider} />

      <Typography className={styles.inputLabel}>Add Collaborators</Typography>

      <Box className={styles.collaborators}>
        <Box className={styles.collaboratorChips}>
          {collaborators.map((collaborator) => (
            <Chip
              key={collaborator.id}
              avatar={<Avatar>{collaborator.initials}</Avatar>}
              label={collaborator.name}
              onDelete={() => undefined}
            />
          ))}

          <IconButton className={styles.addCollaboratorButton} aria-label="Add collaborator">
            <Add />
          </IconButton>
        </Box>

        <IconButton
          className={styles.submitTaskButton}
          aria-label="Create task"
          onClick={() => {
            void handleCreateTask();
          }}
          disabled={isLoading}
        >
          <ArrowForward />
        </IconButton>
      </Box>
    </section>
  );
};
