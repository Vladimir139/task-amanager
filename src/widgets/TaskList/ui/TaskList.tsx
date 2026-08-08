import { Box, Typography } from "@mui/material";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

import { useGetDashboardTasksQuery } from "@/entities/dashboard";
import { type Task, TaskCard } from "@/entities/task";
import { getTasksRoute } from "@/shared/config/router";
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
  const navigate = useNavigate();
  const { data, isError, isLoading } = useGetDashboardTasksQuery();

  const tasks =
    data?.map((task) => ({
      card: {
        comments: task.commentCount,
        id: task._id,
        progress: getTaskProgress(task),
        time: formatTimeLabel(task.dueDate ?? task.createdAt),
        title: task.title,
        url: task.description || (task.shortCode ?? "No description yet"),
      } satisfies Task,
      route: getTasksRoute(task.projectId, task.boardId, task._id),
    })) ?? [];

  return (
    <section className={styles.tasksSection}>
      <Typography component="h2">Assigned tasks</Typography>

      {isError && <Typography>Unable to load assigned tasks.</Typography>}
      {isLoading && <Typography>Loading tasks...</Typography>}
      {!isLoading && !isError && tasks.length === 0 && (
        <Typography>No assigned tasks yet.</Typography>
      )}

      <Box className={styles.tasksList}>
        {tasks.map((task) => (
          <TaskCard
            key={task.card.id}
            task={task.card}
            onOpen={() => {
              void navigate(task.route);
            }}
          />
        ))}
      </Box>
    </section>
  );
};
