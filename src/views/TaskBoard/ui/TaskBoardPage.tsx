import { Box } from "@mui/material";
import type { FC } from "react";

import { TaskBoardColumns, TaskBoardHeader, TaskBoardSidebar } from "@/widgets";

import { useTaskBoardPage } from "../model/useTaskBoardPage.ts";
import styles from "./TaskBoardPage.module.scss";

export const TaskBoardPage: FC = () => {
  const {
    boardColumns,
    boardMembers,
    boardMessages,
    message,
    setMessage,
    taskBoardEmoji,
    taskBoardExtraMembersCount,
    taskBoardMembersCount,
    taskBoardTitle,
  } = useTaskBoardPage();

  return (
    <Box className={styles.page}>
      <div className={styles.boardContent}>
        <TaskBoardHeader
          emoji={taskBoardEmoji}
          title={taskBoardTitle}
          members={boardMembers.slice(0, 5)}
          extraMembersCount={taskBoardExtraMembersCount}
        />

        <TaskBoardColumns columns={boardColumns} />
      </div>

      <TaskBoardSidebar
        members={boardMembers.slice(0, 6)}
        membersCount={taskBoardMembersCount}
        messages={boardMessages}
        message={message}
        onMessageChange={setMessage}
      />
    </Box>
  );
};
