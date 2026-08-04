import { Add } from "@mui/icons-material";
import { AvatarGroup, Box, IconButton, Typography } from "@mui/material";
import type { FC } from "react";

import type { BoardMember } from "@/entities/boardMember";
import { BoardMemberAvatar } from "@/entities/boardMember";

import styles from "./TaskBoardHeader.module.scss";

interface TaskBoardHeaderProps {
  emoji: string;
  title: string;
  members: BoardMember[];
  extraMembersCount: number;
}

export const TaskBoardHeader: FC<TaskBoardHeaderProps> = ({
  emoji,
  title,
  members,
  extraMembersCount,
}) => {
  return (
    <Box className={styles.boardTop}>
      <Typography component="h1">
        <span>{emoji}</span>
        {title}
      </Typography>

      <Box className={styles.boardMemberSummary}>
        <AvatarGroup max={5} className={styles.boardMemberGroup}>
          {members.map((member) => (
            <BoardMemberAvatar
              key={member.id}
              member={member}
              className={styles.boardMemberAvatar}
            />
          ))}
        </AvatarGroup>

        <Typography>{`+${extraMembersCount}`}</Typography>

        <IconButton aria-label="Add board member">
          <Add />
        </IconButton>
      </Box>
    </Box>
  );
};
