import { AvatarGroup, Box, MenuItem, TextField, Typography } from "@mui/material";
import type { FC } from "react";

import type { BoardMember } from "@/entities/boardMember";
import { BoardMemberAvatar } from "@/entities/boardMember";
import type { BoardRecord } from "@/shared/api/types";

import styles from "./TaskBoardHeader.module.scss";

interface TaskBoardHeaderProps {
  activeBoardId: string | null;
  boards: BoardRecord[];
  emoji: string;
  title: string;
  members: BoardMember[];
  extraMembersCount: number;
  onBoardSelect: (boardId: string) => void;
}

export const TaskBoardHeader: FC<TaskBoardHeaderProps> = ({
  activeBoardId,
  boards,
  emoji,
  title,
  members,
  extraMembersCount,
  onBoardSelect,
}) => {
  return (
    <Box className={styles.boardTop}>
      <Box className={styles.boardHeading}>
        <Typography component="h1">
          <span>{emoji}</span>
          {title}
        </Typography>

        {boards.length > 0 && activeBoardId && (
          <TextField
            select
            label="Board"
            size="small"
            value={activeBoardId}
            onChange={(event) => {
              onBoardSelect(event.target.value);
            }}
            className={styles.boardSelect}
          >
            {boards.map((board) => (
              <MenuItem key={board._id} value={board._id}>
                {board.title}
                {board.isDefault ? " (Default)" : ""}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>

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

        {extraMembersCount > 0 && <Typography>{`+${extraMembersCount}`}</Typography>}
      </Box>
    </Box>
  );
};
