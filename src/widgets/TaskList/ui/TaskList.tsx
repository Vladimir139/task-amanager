import { Box, Typography } from "@mui/material";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

import { useGetDashboardTasksQuery } from "@/entities/dashboard";
import { type Task, TaskCard } from "@/entities/task";
import { getTasksRoute } from "@/shared/config/router";
import { formatDateLabel } from "@/shared/lib/formatters";

import styles from "./TaskList.module.scss";

const getTaskDescription = (description?: string | null, shortCode?: string | null): string => {
  const normalizedDescription = description?.trim();

  if (normalizedDescription) {
    return normalizedDescription;
  }

  const normalizedShortCode = shortCode?.trim();
  const fallbackDescription = normalizedShortCode === "" ? undefined : normalizedShortCode;

  return fallbackDescription ?? "No description yet";
};

export const TaskList: FC = () => {
  const navigate = useNavigate();
  const { data, isError, isLoading } = useGetDashboardTasksQuery();

  const tasks =
    data?.map((task) => ({
      card: {
        assigneeCount: task.assigneeIds.length,
        checklistCompleted: task.checklistCompleted,
        checklistTotal: task.checklistTotal,
        comments: task.commentCount,
        description: getTaskDescription(task.description, task.shortCode),
        dueDate: formatDateLabel(task.dueDate),
        id: task._id,
        startDate: formatDateLabel(task.startDate),
        title: task.title,
        watcherCount: task.watcherIds.length,
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
