import { AttachFile, ChatBubbleOutlined, CheckCircleOutlined } from "@mui/icons-material";
import { AvatarGroup, Box, Paper, Typography } from "@mui/material";
import type { FC } from "react";

import { BoardMemberAvatar } from "@/entities/boardMember";

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
  return (
    <Paper
      className={`${styles.taskCard} ${onClick ? styles.clickableCard : ""}`}
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
        <AvatarGroup
          max={4}
          className={styles.taskMembers}
          slotProps={{
            surplus: {
              className: styles.additionalAvatar,
            },
          }}
        >
          {task.members.map((member) => (
            <BoardMemberAvatar
              key={member.id}
              member={member}
              className={styles.taskMemberAvatar}
            />
          ))}
        </AvatarGroup>

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
        </Box>
      </Box>
    </Paper>
  );
};
