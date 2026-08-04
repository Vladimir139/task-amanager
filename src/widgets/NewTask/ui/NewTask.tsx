import { Add, ArrowBackIosNew, ArrowForward, ArrowForwardIos, MoreVert } from "@mui/icons-material";
import { Avatar, Box, Chip, IconButton, TextField, Typography } from "@mui/material";
import type { ChangeEvent, FC } from "react";
import { useState } from "react";

import { taskEmojis } from "../model/constants";
import styles from "./NewTask.module.scss";

export const NewTask: FC = () => {
  const [taskTitle, setTaskTitle] = useState("Create new");
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const handleTaskTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(event.target.value);
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
  };

  const handleCreateTask = () => {
    const normalizedTitle = taskTitle.trim();

    if (!normalizedTitle) {
      return;
    }

    const newTask = {
      title: normalizedTitle,
      emoji: selectedEmoji,
      collaboratorIds: [1, 2],
    };

    console.log("Create task:", newTask);
  };

  return (
    <section className={styles.newTaskSection}>
      <Box className={styles.newTaskHeader}>
        <Typography component="h2">New Task</Typography>

        <IconButton aria-label="Task menu">
          <MoreVert />
        </IconButton>
      </Box>

      <Typography className={styles.inputLabel}>Task Title - Artyfact (Project)</Typography>

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
          <Chip avatar={<Avatar>AN</Avatar>} label="Angela" onDelete={() => undefined} />

          <Chip avatar={<Avatar>CH</Avatar>} label="Chris" onDelete={() => undefined} />

          <IconButton className={styles.addCollaboratorButton} aria-label="Add collaborator">
            <Add />
          </IconButton>
        </Box>

        <IconButton
          className={styles.submitTaskButton}
          aria-label="Create task"
          onClick={handleCreateTask}
        >
          <ArrowForward />
        </IconButton>
      </Box>
    </section>
  );
};
