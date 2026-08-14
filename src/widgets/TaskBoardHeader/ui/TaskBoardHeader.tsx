import { AddCircleOutlined, EditOutlined, ViewColumnOutlined } from "@mui/icons-material";
import {
  AvatarGroup,
  Box,
  Button,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import type { FC } from "react";

import type { BoardMember } from "@/entities/boardMember";
import { BoardMemberAvatar } from "@/entities/boardMember";
import type { BoardRecord } from "@/shared/api/types";

import styles from "./TaskBoardHeader.module.scss";

interface TaskBoardHeaderProps {
  activeBoardId: string | null;
  boards: BoardRecord[];
  canManageBoard: boolean;
  emoji: string;
  isMakingProjectGlobal?: boolean;
  title: string;
  members: BoardMember[];
  extraMembersCount: number;
  onCreateBoard?: () => void;
  onCreateColumn?: () => void;
  onBoardSelect: (boardId: string) => void;
  onEditBoard?: () => void;
  onMakeProjectGlobal?: () => void;
  showMakeProjectGlobalButton?: boolean;
}

export const TaskBoardHeader: FC<TaskBoardHeaderProps> = ({
  activeBoardId,
  boards,
  canManageBoard,
  emoji,
  isMakingProjectGlobal = false,
  title,
  members,
  extraMembersCount,
  onCreateBoard,
  onCreateColumn,
  onBoardSelect,
  onEditBoard,
  onMakeProjectGlobal,
  showMakeProjectGlobalButton = false,
}) => {
  return (
    <Box className={styles.boardTop}>
      <Box className={styles.boardHeading}>
        <Typography component="h1">
          <span>{emoji}</span>
          {title}
        </Typography>

        {boards.length > 0 && activeBoardId && (
          <Box className={styles.boardControls}>
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

            <IconButton
              aria-label="Edit current board"
              className={styles.headerIconButton}
              disabled={!canManageBoard}
              onClick={onEditBoard}
            >
              <EditOutlined />
            </IconButton>

            <Button
              variant="outlined"
              className={styles.headerActionButton}
              disabled={!canManageBoard}
              startIcon={<AddCircleOutlined />}
              onClick={onCreateBoard}
            >
              Create board
            </Button>

            <Button
              variant="outlined"
              className={styles.headerActionButton}
              disabled={!canManageBoard}
              startIcon={<ViewColumnOutlined />}
              onClick={onCreateColumn}
            >
              Create column
            </Button>

            {showMakeProjectGlobalButton && (
              <Button
                variant="contained"
                className={styles.makeGlobalButton}
                disabled={isMakingProjectGlobal}
                onClick={onMakeProjectGlobal}
              >
                {isMakingProjectGlobal ? "Saving..." : "Make global"}
              </Button>
            )}
          </Box>
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
