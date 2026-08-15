import {
  ChatBubbleOutlined,
  CheckCircleOutlined,
  DescriptionOutlined,
  GroupsOutlined,
  RadioButtonUncheckedOutlined,
  RemoveRedEyeOutlined,
} from "@mui/icons-material";
import { Box, LinearProgress, Paper, Typography } from "@mui/material";
import type { FC } from "react";

import type { TaskCardProps } from "@/entities/task";

import styles from "./TaskCard.module.scss";

export const TaskCard: FC<TaskCardProps> = ({ onOpen, task }) => {
  const hasSubtasks = task.checklistTotal > 0;
  const progress = hasSubtasks
    ? Math.round((task.checklistCompleted / task.checklistTotal) * 100)
    : 0;
  const isCompleted = task.isCompleted ?? false;

  return (
    <Paper
      className={`${styles.taskCard} ${isCompleted ? styles.completedTaskCard : ""}`}
      elevation={0}
    >
      <Box className={styles.taskTimeline}>
        <Box>
          <Typography className={styles.timelineLabel}>Start from</Typography>
          <Typography className={styles.timelineValue}>{task.startDate}</Typography>
        </Box>

        <Box>
          <Typography className={styles.timelineLabel}>End at</Typography>
          <Typography className={styles.timelineValue}>{task.dueDate}</Typography>
        </Box>
      </Box>

      <Box className={styles.taskInformation}>
        <Typography className={styles.taskTitle}>{task.title}</Typography>

        <Box className={styles.taskMeta}>
          <Box>
            <DescriptionOutlined />
            <span>{task.description}</span>
          </Box>

          <span className={styles.taskMetaDivider} />

          <Box>
            <GroupsOutlined />
            <span>{task.assigneeCount} assignees</span>
          </Box>

          <span className={styles.taskMetaDivider} />

          <Box>
            <RemoveRedEyeOutlined />
            <span>{task.watcherCount} watchers</span>
          </Box>

          <span className={styles.taskMetaDivider} />

          <Box>
            <ChatBubbleOutlined />
            <span>{task.comments} comments</span>
          </Box>
        </Box>
      </Box>

      <Box className={styles.taskProgress}>
        <Typography>
          {hasSubtasks
            ? `${task.checklistCompleted}/${task.checklistTotal} subtasks complete`
            : "No subtasks yet"}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progress}
          className={styles.progressBar}
          aria-label={
            hasSubtasks
              ? `${task.checklistCompleted} of ${task.checklistTotal} subtasks complete`
              : "No subtasks configured"
          }
        />
      </Box>

      <Box className={styles.taskActions}>
        <button
          type="button"
          className={`${styles.completeToggleButton} ${
            isCompleted ? styles.completedToggleButton : ""
          }`}
          onClick={task.onToggleCompleted}
          disabled={!task.onToggleCompleted}
          aria-label={isCompleted ? `Mark ${task.title} as open` : `Mark ${task.title} as done`}
        >
          {isCompleted ? <CheckCircleOutlined /> : <RadioButtonUncheckedOutlined />}
        </button>

        <button type="button" className={styles.openTaskButton} onClick={onOpen} disabled={!onOpen}>
          Open task
        </button>
      </Box>
    </Paper>
  );
};
