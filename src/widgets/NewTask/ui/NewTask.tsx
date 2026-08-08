import { Add, ArrowBackIosNew, ArrowForward, ArrowForwardIos, MoreVert } from "@mui/icons-material";
import { Avatar, Box, Chip, IconButton, TextField, Typography } from "@mui/material";
import type { ChangeEvent, FC } from "react";
import { useMemo, useState } from "react";

import { useGetBoardViewQuery } from "@/entities/board/api/boardsApi";
import { useGetProjectsQuery } from "@/entities/project";
import { useCreateTaskMutation } from "@/entities/task";
import { getInitials } from "@/shared/lib/formatters";

import { taskEmojis } from "../model/constants";
import styles from "./NewTask.module.scss";

export const NewTask: FC = () => {
  const [taskTitle, setTaskTitle] = useState("Create new");
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const { data: projects } = useGetProjectsQuery({ limit: 1, page: 1 });
  const firstProject = projects?.items[0];
  const { data: boardView } = useGetBoardViewQuery(firstProject?._id ?? "", {
    skip: !firstProject?._id,
  });
  const [createTask, { isLoading }] = useCreateTaskMutation();

  const collaborators = useMemo(() => {
    return (boardView?.members ?? []).slice(0, 2).map((member) => ({
      id: member._id,
      initials: getInitials(member.firstName, member.lastName),
      name: `${member.firstName} ${member.lastName}`.trim(),
    }));
  }, [boardView?.members]);

  const handleTaskTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(event.target.value);
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
  };

  const handleCreateTask = async () => {
    const normalizedTitle = taskTitle.trim();
    const firstColumnId = boardView?.columns[0]?._id;
    const boardId = boardView?.board._id;

    if (!normalizedTitle || !firstProject?._id || !boardId || !firstColumnId) {
      return;
    }

    await createTask({
      assigneeIds: collaborators.map((collaborator) => String(collaborator.id)),
      boardId,
      category: "planning",
      columnId: firstColumnId,
      description: `Created from dashboard quick action for ${firstProject.title}`,
      emoji: selectedEmoji ?? undefined,
      priority: "medium",
      projectId: firstProject._id,
      title: normalizedTitle,
    }).unwrap();

    setTaskTitle("");
    setSelectedEmoji(null);
  };

  return (
    <section className={styles.newTaskSection}>
      <Box className={styles.newTaskHeader}>
        <Typography component="h2">New Task</Typography>

        <IconButton aria-label="Task menu">
          <MoreVert />
        </IconButton>
      </Box>

      <Typography className={styles.inputLabel}>
        Task Title {firstProject ? `- ${firstProject.title}` : "- No project yet"}
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
