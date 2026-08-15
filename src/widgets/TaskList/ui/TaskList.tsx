import { Box, Typography } from "@mui/material";
import type { FC } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetDashboardTasksQuery } from "@/entities/dashboard";
import { type Task, TaskCard } from "@/entities/task";
import { useUpdateTaskMutation } from "@/features/updateTask";
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
  const [showAll, setShowAll] = useState(false);
  const { data, isError, isLoading } = useGetDashboardTasksQuery();
  const [updateTask] = useUpdateTaskMutation();

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
        isCompleted: task.workflowState === "done",
        onToggleCompleted: () => {
          void updateTask({
            boardId: task.boardId,
            projectId: task.projectId,
            taskId: task._id,
            workflowState: task.workflowState === "done" ? "open" : "done",
          });
        },
        startDate: formatDateLabel(task.startDate),
        title: task.title,
        watcherCount: task.watcherIds.length,
      } satisfies Task,
      route:
        task.projectId && task.boardId
          ? getTasksRoute(task.projectId, task.boardId, task._id)
          : null,
    })) ?? [];
  const visibleTasks = showAll ? tasks : tasks.slice(0, 4);

  return (
    <section className={styles.tasksSection}>
      <Box className={styles.headerRow}>
        <Typography component="h2">Assigned tasks</Typography>
        {tasks.length > 4 && (
          <button
            type="button"
            className={styles.showAllButton}
            onClick={() => {
              setShowAll((currentState) => !currentState);
            }}
          >
            {showAll ? "Show less" : "Show all"}
          </button>
        )}
      </Box>

      {isError && <Typography>Unable to load assigned tasks.</Typography>}
      {isLoading && <Typography>Loading tasks...</Typography>}
      {!isLoading && !isError && tasks.length === 0 && (
        <Typography>No assigned tasks yet.</Typography>
      )}

      <Box className={styles.tasksList}>
        {visibleTasks.map((task) => (
          <TaskCard
            key={task.card.id}
            task={task.card}
            onOpen={
              task.route
                ? () => {
                    const route = task.route;

                    if (!route) {
                      return;
                    }

                    void navigate(route);
                  }
                : undefined
            }
          />
        ))}
      </Box>
    </section>
  );
};
