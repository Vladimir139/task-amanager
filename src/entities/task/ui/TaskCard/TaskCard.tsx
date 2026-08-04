import { ChatBubbleOutlined, Link, PlayArrow, TimerOutlined } from "@mui/icons-material";
import { Box, IconButton, LinearProgress, Paper, Typography } from "@mui/material";
import type { FC } from "react";

import type { TaskCardProps } from "@/entities/task/model/types.ts";

import styles from "./TaskCard.module.scss";

export const TaskCard: FC<TaskCardProps> = ({ task }) => {
  return (
    <Paper className={styles.taskCard} elevation={0}>
      <Box className={styles.taskStart}>
        <IconButton className={styles.playButton}>
          <PlayArrow />
        </IconButton>

        <Box>
          <Typography className={styles.taskStartTitle}>Start from</Typography>

          <Box className={styles.taskTime}>
            <TimerOutlined />
            <span>{task.time}</span>
          </Box>
        </Box>
      </Box>

      <Box className={styles.taskInformation}>
        <Typography className={styles.taskTitle}>{task.title}</Typography>

        <Box className={styles.taskMeta}>
          <Box>
            <Link />
            <span>{task.url}</span>
          </Box>

          <span className={styles.taskMetaDivider} />

          <Box>
            <ChatBubbleOutlined />
            <span>{task.comments} comments</span>
          </Box>
        </Box>
      </Box>

      <Box className={styles.taskProgress}>
        <Typography>{task.progress}% complete</Typography>

        <LinearProgress
          variant="determinate"
          value={task.progress}
          className={styles.progressBar}
        />
      </Box>

      <button type="button" className={styles.reminderButton}>
        <TimerOutlined />
        Reminder
      </button>
    </Paper>
  );
};
