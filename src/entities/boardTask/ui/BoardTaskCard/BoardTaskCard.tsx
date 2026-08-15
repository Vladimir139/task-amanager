import {
  AttachFile,
  ChatBubbleOutlined,
  CheckCircleOutlined,
  RadioButtonUncheckedOutlined,
} from "@mui/icons-material";
import { Box, Paper, Typography } from "@mui/material";
import type { FC } from "react";

import { MemberAvatarStack } from "@/shared/ui/molecules/MemberAvatarStack/MemberAvatarStack";

import type { BoardTaskCardProps, TaskCategory } from "../../model/types.ts";
import styles from "./BoardTaskCard.module.scss";

const categoryClassNames: Record<TaskCategory, string> = {
  Content: styles.contentCategory,
  Design: styles.designCategory,
  Development: styles.planningCategory,
  Other: styles.researchCategory,
  Planning: styles.planningCategory,
  Research: styles.researchCategory,
};

export const BoardTaskCard: FC<BoardTaskCardProps> = ({ onClick, task }) => {
  const isCompleted = task.isCompleted ?? false;

  return (
    <Paper
      className={`${styles.taskCard} ${onClick ? styles.clickableCard : ""} ${
        isCompleted ? styles.completedTaskCard : ""
      }`}
      elevation={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick || (event.key !== "Enter" && event.key !== " ")) {
          return;
        }

        event.preventDefault();
        onClick();
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <Box className={`${styles.taskCategory} ${categoryClassNames[task.category]}`}>
        {task.category}
      </Box>

      {task.image && <Box component="img" src={task.image} alt="" className={styles.taskImage} />}

      <Typography component="h3" className={styles.taskTitle}>
        {task.title}
      </Typography>

      <Typography className={styles.taskDescription}>{task.description}</Typography>

      <Box className={styles.taskDate}>{task.date}</Box>

      <Box className={styles.taskFooter}>
        <MemberAvatarStack
          items={task.members.map((member) => ({
            avatarUrl: member.avatarUrl,
            id: member.id,
            initials: member.initials,
            name: member.name ?? member.initials,
            role: member.role,
          }))}
          title={`${task.title} assignees`}
        />

        <Box className={styles.taskStatistics}>
          {task.comments !== undefined && (
            <Box>
              <ChatBubbleOutlined />
              <span>{task.comments} Comment</span>
            </Box>
          )}

          {task.files !== undefined && (
            <Box>
              <AttachFile />
              <span>{task.files} file</span>
            </Box>
          )}

          {task.total !== undefined && (
            <Box>
              <CheckCircleOutlined />
              <span>
                {task.completed}/{task.total}
              </span>
            </Box>
          )}

          <button
            type="button"
            className={`${styles.completeToggleButton} ${
              isCompleted ? styles.completedToggleButton : ""
            }`}
            onClick={(event) => {
              event.stopPropagation();
              task.onToggleCompleted?.();
            }}
            disabled={!task.onToggleCompleted}
            aria-label={isCompleted ? `Mark ${task.title} as open` : `Mark ${task.title} as done`}
          >
            {isCompleted ? <CheckCircleOutlined /> : <RadioButtonUncheckedOutlined />}
          </button>
        </Box>
      </Box>
    </Paper>
  );
};
