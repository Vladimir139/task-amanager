import {
  ChatBubbleOutlined,
  DescriptionOutlined,
  GroupsOutlined,
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

  return (
    <Paper className={styles.taskCard} elevation={0}>
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

      <button type="button" className={styles.openTaskButton} onClick={onOpen} disabled={!onOpen}>
        Open task
      </button>
    </Paper>
  );
};
