import { Box, Typography } from "@mui/material";
import type { FC } from "react";

import { useGetDashboardTasksQuery } from "@/entities/dashboard/api/dashboardApi";
import { type Task, TaskCard } from "@/entities/task";
import { formatTimeLabel } from "@/shared/lib/formatters";

import styles from "./TaskList.module.scss";

const getTaskProgress = (task: {
  checklistCompleted: number;
  checklistTotal: number;
  workflowState: string;
}): number => {
  if (task.checklistTotal > 0) {
    return Math.round((task.checklistCompleted / task.checklistTotal) * 100);
  }

  return task.workflowState === "done" ? 100 : 45;
};

export const TaskList: FC = () => {
  const { data, isError, isLoading } = useGetDashboardTasksQuery();

  const tasks: Task[] =
    data?.map((task) => ({
      comments: task.commentCount,
      id: task._id,
      progress: getTaskProgress(task),
      time: formatTimeLabel(task.dueDate ?? task.createdAt),
      title: task.title,
      url: task.description || (task.shortCode ?? "No description yet"),
    })) ?? [];

  return (
    <section className={styles.tasksSection}>
      <Typography component="h2">Task</Typography>

      {isError && <Typography>Unable to load assigned tasks.</Typography>}
      {isLoading && <Typography>Loading tasks...</Typography>}

      <Box className={styles.tasksList}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Box>
    </section>
  );
};
