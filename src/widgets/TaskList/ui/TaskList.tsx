import { Box, Typography } from "@mui/material";
import type { FC } from "react";

import { TaskCard } from "@/entities/task/ui";

import { tasks } from "../model/tasks.data";
import styles from "./TaskList.module.scss";

export const TaskList: FC = () => {
  return (
    <section className={styles.tasksSection}>
      <Typography component="h2">Task</Typography>

      <Box className={styles.tasksList}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Box>
    </section>
  );
};
