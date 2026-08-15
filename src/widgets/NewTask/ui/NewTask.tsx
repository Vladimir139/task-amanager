import { Add, ArrowForward } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import type { FC, MouseEvent } from "react";
import { useMemo, useState } from "react";

import { taskEmojis, useQuickCreateTask } from "@/features/createTask";

import styles from "./NewTask.module.scss";

export const NewTask: FC = () => {
  const [collaboratorMenuAnchor, setCollaboratorMenuAnchor] = useState<HTMLElement | null>(null);
  const {
    canCreateTask,
    collaborators,
    currentProjectTitle,
    handleCreateTask,
    handleProjectChange,
    handleCollaboratorToggle,
    handleEmojiSelect,
    handleTaskTitleChange,
    helperMessage,
    isLoading,
    isProjectReady,
    projectOptions,
    selectedEmoji,
    selectedCollaboratorIds,
    selectedProjectId,
    taskTitle,
  } = useQuickCreateTask();
  const selectedCollaborators = useMemo(
    () => collaborators.filter((collaborator) => selectedCollaboratorIds.includes(collaborator.id)),
    [collaborators, selectedCollaboratorIds],
  );

  const handleOpenCollaboratorMenu = (event: MouseEvent<HTMLElement>): void => {
    setCollaboratorMenuAnchor(event.currentTarget);
  };

  const handleCloseCollaboratorMenu = (): void => {
    setCollaboratorMenuAnchor(null);
  };

  return (
    <section className={styles.newTaskSection}>
      <Box className={styles.newTaskHeader}>
        <Typography component="h2">New Task</Typography>
      </Box>

      <Typography className={styles.inputLabel}>Project</Typography>
      <TextField
        select
        fullWidth
        value={selectedProjectId}
        onChange={(event) => {
          handleProjectChange(event.target.value);
        }}
        className={styles.projectSelect}
        disabled={isLoading}
      >
        {projectOptions.map((project) => (
          <MenuItem key={project.id || "without-project"} value={project.id}>
            {project.title}
          </MenuItem>
        ))}
      </TextField>

      <Typography className={styles.projectHelperText}>
        {currentProjectTitle
          ? `Tasks will be created in ${currentProjectTitle} and added to backlog by default.`
          : "Choose a project for the new task."}
      </Typography>

      <Typography className={styles.inputLabel}>Task Title</Typography>

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

      <Box className={styles.collaboratorHeader}>
        <Box className={styles.collaborators}>
          <Box className={styles.collaboratorChips}>
            {selectedCollaborators.length === 0 ? (
              <Typography className={styles.helperText}>No collaborators selected.</Typography>
            ) : (
              selectedCollaborators.map((collaborator) => (
                <Chip
                  key={collaborator.id}
                  avatar={<Avatar>{collaborator.initials}</Avatar>}
                  label={collaborator.name}
                  className={styles.selectedCollaboratorChip}
                  onDelete={() => {
                    handleCollaboratorToggle(collaborator.id);
                  }}
                />
              ))
            )}
          </Box>
        </Box>

        <IconButton
          className={styles.addCollaboratorButton}
          aria-label="Choose collaborators"
          onClick={handleOpenCollaboratorMenu}
          disabled={!isProjectReady || collaborators.length === 0}
        >
          <Add />
        </IconButton>
      </Box>

      <Menu
        anchorEl={collaboratorMenuAnchor}
        open={Boolean(collaboratorMenuAnchor)}
        onClose={handleCloseCollaboratorMenu}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        {collaborators.length === 0 ? (
          <MenuItem disabled>No collaborators available.</MenuItem>
        ) : (
          collaborators.map((collaborator) => {
            const isSelected = selectedCollaboratorIds.includes(collaborator.id);

            return (
              <MenuItem
                key={collaborator.id}
                onClick={() => {
                  handleCollaboratorToggle(collaborator.id);
                }}
                className={styles.collaboratorMenuItem}
              >
                <Checkbox checked={isSelected} size="small" />
                <Avatar className={styles.collaboratorMenuAvatar}>{collaborator.initials}</Avatar>
                <Typography>{collaborator.name}</Typography>
              </MenuItem>
            );
          })
        )}
      </Menu>

      <Box className={styles.submitRow}>
        <Box className={styles.collaboratorSelectionHint}>
          {collaborators.length === 0 ? (
            <Typography className={styles.helperText}>No collaborators available.</Typography>
          ) : (
            <Typography className={styles.helperText}>
              Use the plus button to add or remove project members.
            </Typography>
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
